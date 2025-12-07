import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-20">
      <div className="container-luxury max-w-3xl">
        <div className="text-center mb-16">
          <h1 className="font-luxury text-5xl mb-6">{t('footer.about')}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Discover the story behind LUXE
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="font-luxury text-3xl mb-4">Our Mission</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              At LUXE, we believe that luxury fashion should be accessible and authentic. Our mission is to curate the finest collection of bags, scarfs, and watches from designers around the world, bringing timeless elegance to discerning customers.
            </p>
          </section>

          <section>
            <h2 className="font-luxury text-3xl mb-4">Quality & Authenticity</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Every item in our collection is carefully selected and authenticated. We work exclusively with authorized dealers and verified sources to ensure that every piece meets our exacting standards for quality, craftsmanship, and authenticity.
            </p>
          </section>

          <section>
            <h2 className="font-luxury text-3xl mb-4">Our Commitment</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We are committed to providing exceptional customer service, fast and secure shipping, and a seamless shopping experience. Your satisfaction is our priority, and we stand behind every product we sell.
            </p>
          </section>

          <section className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
            <h2 className="font-luxury text-2xl mb-4">Why Choose LUXE?</h2>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-luxury-gold">✓</span>
                <span>Carefully curated selection of luxury items</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-luxury-gold">✓</span>
                <span>100% authentic products with guarantees</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-luxury-gold">✓</span>
                <span>Discreet and secure packaging</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-luxury-gold">✓</span>
                <span>Fast worldwide shipping</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-luxury-gold">✓</span>
                <span>Exceptional customer support</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-luxury-gold">✓</span>
                <span>Easy returns and exchanges</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
