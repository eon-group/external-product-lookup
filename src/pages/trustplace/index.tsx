import { useRouter } from 'next/router';
import Error from 'next/error';
import styles from '@/styles/trustplace.module.css';

export default function TrustplaceForm() {
  const router = useRouter();
  const { ref_id } = router.query;

  if (!ref_id) {
    return <Error statusCode={404} title="Not found" />;
  }
  return (
    <section className="page">
      <form
        className={styles.form}
        action="/api/verify-trustplace"
        method="post">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required />
        <input type="hidden" name="ref_id" value={ref_id} />
        <button type="submit">Verify</button>
      </form>
    </section>
  );
}
