import styles from '@/styles/trustplace.module.css';

export default function TrustplaceSupportPage() {
  return (
    <section className="page">
      <h4>We are unable to process your request at this time</h4>
      <div className={styles.detail}>
        <p>Please try again later</p>
      </div>
    </section>
  );
}
