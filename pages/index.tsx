import Head from "next/head"
// TODO: fix vscode lint
// import styles from "../styles/Home.module.css"
export default function Home() {
  // TODO:
  // function PresentationalComponent(props: HasVariants) {
  //   return <div>I'm showing variant {props.variant}</div>
  // }

  // const BanditPresentationalComponent = WithInstantBandit(
  //   PresentationalComponent,
  //   "my_experiment_id",
  //   "a"
  // )

  return (
    <div
    // className={styles.container}
    >
      <Head>
        <title>Instant Bandit</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
      // className={styles.main}
      >
        <h1
        // className={styles.title}
        >
          Welcome to Instant Bandit
        </h1>
        <a href="/api/hello" target="_blank">
          test api
        </a>
      </main>

      <footer
      // className={styles.footer}
      >
        footer
      </footer>
    </div>
  )
}
