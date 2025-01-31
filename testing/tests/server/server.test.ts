/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  InstantBanditServerOptions,
  MetricsBackend,
  ModelsBackend,
  SessionsBackend,
} from "../../../lib/server/server-types";
import { buildInstantBanditServer } from "../../../lib/server/server-core";
import { SessionDescriptor } from "../../../lib/types";
import { makeNewSession } from "../../../lib/utils";


describe("server", () => {
  const TEST_CONFIG: InstantBanditServerOptions = {
    clientOrigins: [],
    metrics: getStubMetrics(),
    models: getStubModels(),
    sessions: getStubSessions(),
  };

  let config: InstantBanditServerOptions = TEST_CONFIG;
  let server = buildInstantBanditServer(config);

  beforeEach(async () => {
    server = buildInstantBanditServer(config);
  });


  describe("lifecycle", () => {
    let connectedMetrics = 0, disconnectedMetrics = 0;
    let connectedModels = 0, disconnectedModels = 0;
    let connectedSessions = 0, disconnectedSessions = 0;

    beforeEach(() => {
      connectedMetrics = 0, disconnectedMetrics = 0;
      connectedModels = 0, disconnectedModels = 0;
      connectedSessions = 0, disconnectedSessions = 0;

      config = Object.assign(TEST_CONFIG, {
        metrics: {
          async connect() { ++connectedMetrics; },
          async disconnect() { ++disconnectedMetrics; },
        },
        models: {
          async connect() { ++connectedModels; },
          async disconnect() { ++disconnectedModels; },
        },
        sessions: {
          async connect() { ++connectedSessions; },
          async disconnect() { ++disconnectedSessions; },
        },
      });
    });

    describe("init", () => {
      it("calls connect on any backends requiring connect logic", async () => {
        server = buildInstantBanditServer(config);
        await server.init();
        expect(connectedMetrics).toBe(1);
        expect(connectedModels).toBe(1);
        expect(connectedSessions).toBe(1);
      });

      it("can be called multiple times", async () => {
        server = buildInstantBanditServer(config);
        await server.init();
        await server.init();
        await server.init();
        expect(connectedMetrics).toBe(1);
        expect(connectedModels).toBe(1);
        expect(connectedSessions).toBe(1);
      });
    });

    describe("shutdown", () => {
      it("calls disconnect on any backends requiring disconnect logic", async () => {
        server = buildInstantBanditServer(config);
        await server.init();

        await server.shutdown();
        expect(disconnectedMetrics).toBe(1);
        expect(disconnectedModels).toBe(1);
        expect(disconnectedSessions).toBe(1);
      });

      it("can be called multiple times", async () => {
        server = buildInstantBanditServer(config);
        await server.init();

        await server.shutdown();
        await server.shutdown();
        await server.shutdown();
        expect(disconnectedMetrics).toBe(1);
        expect(disconnectedModels).toBe(1);
        expect(disconnectedSessions).toBe(1);
      });
    });
  });

  function getStubSessions(): SessionsBackend {
    return {
      async connect() { return; },
      async disconnect() { return; },
      async getOrCreateSession() {
        return makeNewSession();
      },
      async markVariantSeen(session: SessionDescriptor) {
        return session;
      },
    };
  }

  function getStubModels(): ModelsBackend {
    return {
      async connect() { return; },
      async disconnect() { return; },
      getSiteConfig() { return void 0 as any; },
    };
  }

  function getStubMetrics(): MetricsBackend {
    return {
      async connect() { return; },
      async disconnect() { return; },
      getMetricsBucket() { return void 0 as any; },
      getMetricsForSite() { return void 0 as any; },
      ingestBatch() { return void 0 as any; },
    };
  }
});
