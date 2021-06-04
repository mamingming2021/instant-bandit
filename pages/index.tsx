import { GetServerSideProps } from 'next'
import Head from "next/head"
import { DemoComponent, experimentId } from "../components/DemoComponent"
import { sendConversion } from "../components/InstantBanditConversion"
import styles from "../styles/Home.module.css"
import { ProbabilityMap } from './api/probabilities'

export default function Home(serverSideProps: ProbabilityMap) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Instant Bandit</title>
        <meta name="description" content="Generated by create next app" />
        <link
          rel="icon"
          // See https://css-tricks.com/emojis-as-favicons/
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚔️</text></svg>"
        />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.description}>Welcome to Instant Bandit</h1>
        <p>
          <DemoComponent preserveSession={false} probabilities={serverSideProps}>
            {(props) => {
              return <button
                className={styles.title}
                // AB test logic here
                style={{ background: props.variant === "A" ? "red" : "green" }}
                onClick={() => {
                  alert(`Your click will be recorded`)
                  sendConversion()
                  // also try:
                  // sendConversion({ experimentIds: [experimentId], value: 99.99 })
                }}
              >
                👉 Click me 👈
              </button>
            }}
          </DemoComponent>
        </p>
      </main>

      <footer className={styles.footer}>
        <a href="/api/hello" target="_blank">
          Is the server running?
        </a>
      </footer>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<ProbabilityMap> = async () => {
  return {
    props: {
      A: 0.5,
      B: 0.5,
    },
  };
};
