import styles from './Footer.module.css'

const links = [
  ['Audio Description', 'Help Centre', 'Gift Cards', 'Media Centre'],
  ['Investor Relations', 'Jobs', 'Terms of Use', 'Privacy'],
  ['Legal Notices', 'Cookie Preferences', 'Corporate Information', 'Contact Us'],
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.social}>Questions? Call <a href="#">000-800-919-1694</a></p>
      <div className={styles.links}>
        {links.flat().map(link => (
          <a key={link} href="#" className={styles.link}>{link}</a>
        ))}
      </div>
      <div className={styles.region}>
        <select className={styles.langSelect}>
          <option>🌐 English</option>
          <option>हिन्दी</option>
        </select>
      </div>
      <p className={styles.copy}>Netflix Clone © {new Date().getFullYear()}</p>
    </footer>
  )
}
