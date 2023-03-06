import styles from '@/styles/trustplace.module.css';

export default function TrustplaceEmailPage() {
  return (
    <section className="page">
      <h4>Thank you for submitting your request</h4>
      <div className={styles.detail}>
        <p>You will receive an email shortly</p>
      </div>
    </section>
  );
}
