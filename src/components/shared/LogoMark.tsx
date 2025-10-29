import styles from './LogoMark.module.css'

function LogoMark() {
  return (
    <div className={styles.logoWrap} aria-label="ByteBuzz logo">
      <span className={styles.symbol}>Byte</span>
      <span className={styles.symbol}>Buzz</span>
    </div>
  )
}

export default LogoMark
