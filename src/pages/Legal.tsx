import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

const UPDATED = '1er octobre 2026'
const EMAIL = 'contact.forgeinformatique@heiphaistos.org'
const PAGES: [string, string][] = [
  ['/mentions-legales', 'Mentions légales'],
  ['/confidentialite', 'Confidentialité'],
  ['/cgu', 'Conditions d’utilisation'],
]

const Mail = () => (
  <a className="text-brand-400 underline break-all" href={`mailto:${EMAIL}`}>
    {EMAIL}
  </a>
)
const Ext = ({ href, children }: { href: string; children: ReactNode }) => (
  <a className="text-brand-400 underline" href={href} target="_blank" rel="noreferrer">
    {children}
  </a>
)

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card p-5 sm:p-6">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <div className="muted mt-3 flex flex-col gap-3 text-sm leading-relaxed">{children}</div>
    </section>
  )
}

function LegalShell({ title, intro, children }: { title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="label text-brand-400">Informations légales</div>
      <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{title}</h1>
      <p className="muted mt-2 text-xs">Dernière mise à jour : {UPDATED}</p>
      <nav aria-label="Pages légales" className="mt-5 flex flex-wrap gap-2">
        {PAGES.map(([to, label]) => (
          <NavLink key={to} to={to} className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="muted mt-6 text-sm leading-relaxed">{intro}</div>
      <div className="mt-6 flex flex-col gap-4">{children}</div>
    </div>
  )
}

export function MentionsLegales() {
  return (
    <LegalShell title="Mentions légales" intro={<p>Ces mentions concernent le site <strong>enginepc.heiphaistos.org</strong>.</p>}>
      <Block title="Éditeur du site">
        <p>Le site est édité à titre personnel et non professionnel par une personne physique publiant sous le pseudonyme <strong>Heiphaistos</strong>.</p>
        <p>
          Conformément à l’article 6-III-2 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique (LCEN), l’éditeur, non
          professionnel, a choisi de préserver son anonymat. Ses éléments d’identification ont été communiqués à l’hébergeur.
        </p>
        <p>Contact : <Mail /></p>
      </Block>
      <Block title="Directeur de la publication">
        <p>L’éditeur du site, tel que désigné ci-dessus.</p>
      </Block>
      <Block title="Hébergement">
        <p>
          <strong>IONOS SE</strong> — Elgendorfer Str. 57, 56410 Montabaur, Allemagne — Tél. : +49 721 170 555 — <Ext href="https://www.ionos.fr">ionos.fr</Ext>
        </p>
      </Block>
      <Block title="Propriété intellectuelle">
        <p>
          Les textes, visuels, logos et le code de ce site sont la propriété de leur éditeur ; le code source est publié sur GitHub sous la licence indiquée sur
          son dépôt. Les données issues de pc-part-dataset (MIT), de la BCE et de Wikipédia restent soumises à leurs licences respectives ; les marques et noms de
          produits cités appartiennent à leurs propriétaires.
        </p>
      </Block>
      <Block title="Prix et performances">
        <p>
          Les prix affichés sont indicatifs ou proviennent du comparateur SearchIT ; ils peuvent différer du prix réel chez le marchand. Les performances sont des
          estimations. L’éditeur ne vend aucun produit et ne perçoit aucune commission.
        </p>
      </Block>
      <Block title="Responsabilité et liens externes">
        <p>
          L’éditeur s’efforce de maintenir des informations exactes et à jour, sans pouvoir le garantir. Les liens vers des marchands ou d’autres sites sont
          fournis à titre informatif ; l’éditeur n’est pas responsable de leur contenu.
        </p>
      </Block>
      <Block title="Signaler un contenu">
        <p>Pour signaler un contenu illicite ou une erreur : <Mail />.</p>
      </Block>
    </LegalShell>
  )
}

export function Confidentialite() {
  return (
    <LegalShell
      title="Confidentialité"
      intro={
        <p>
          En bref : EnginePC n’a ni compte, ni publicité, ni mesure d’audience, ni cookie. Vos configurations et réglages restent dans votre navigateur ; aucune
          donnée personnelle n’est envoyée à l’éditeur.
        </p>
      }
    >
      <Block title="Responsable de traitement">
        <p>L’éditeur du site (voir les mentions légales), joignable à <Mail />.</p>
      </Block>
      <Block title="Journaux techniques du serveur">
        <p>Comme tout serveur web, celui qui héberge ce site enregistre pour chaque requête l’adresse IP, la date, la page demandée et le navigateur utilisé.</p>
        <p>Finalité : sécurité, prévention des abus et diagnostic technique. Base légale : intérêt légitime (article 6.1.f du RGPD). Conservation : 12 mois maximum.</p>
      </Block>
      <Block title="Stockage local de votre navigateur">
        <p>
          Vos configurations enregistrées, la liste de comparaison, les réglages (thème, devise, TVA, informations de devis, adresse et clé d’un comparateur) et
          un cache des taux de change sont conservés dans le stockage local de votre navigateur. Ils ne quittent pas votre appareil et vous pouvez les effacer à
          tout moment depuis les paramètres du navigateur. Ce site ne dépose <strong>aucun cookie</strong>.
        </p>
        <p>Les liens de partage et de devis contiennent la configuration elle-même, encodée dans l’adresse : rien n’est stocké sur le serveur.</p>
      </Block>
      <Block title="Services appelés par votre navigateur">
        <p>
          <strong>Taux de change</strong> : au chargement, votre navigateur interroge <Ext href="https://frankfurter.dev">api.frankfurter.dev</Ext> (taux de
          la BCE, au plus une fois toutes les 12 heures).
        </p>
        <p>
          <strong>Wikipédia</strong> : la fiche détaillée d’un produit interroge fr.wikipedia.org ou en.wikipedia.org et peut afficher une image de
          upload.wikimedia.org (Wikimedia Foundation, États-Unis).
        </p>
        <p>
          <strong>Prix en direct</strong> : les noms et références des composants affichés sont envoyés au comparateur{' '}
          <Ext href="https://searchit.heiphaistos.org">SearchIT</Ext>, édité par le même éditeur, pour obtenir des prix ; aucune donnée personnelle n’est
          jointe. Si vous renseignez un autre comparateur dans les paramètres, les requêtes partent vers celui-ci.
        </p>
        <p>
          Ces services reçoivent votre adresse IP et les informations techniques habituelles d’une requête web. Les liens vers les marchands (Amazon, LDLC…)
          n’envoient rien tant que vous ne cliquez pas.
        </p>
      </Block>
      <Block title="Polices">
        <p>Les polices de caractères sont hébergées avec le site : votre navigateur n’effectue aucun appel à Google Fonts.</p>
      </Block>
      <Block title="Contact par e-mail">
        <p>
          Si vous écrivez à l’adresse de contact, votre message et votre adresse e-mail sont conservés le temps de traiter la demande, puis 3 ans au maximum.
          Base légale : intérêt légitime à répondre aux demandes.
        </p>
      </Block>
      <Block title="Destinataires">
        <p>
          Les données sont traitées sur un serveur hébergé par IONOS SE dans l’Union européenne. Elles ne sont ni vendues, ni cédées, ni utilisées pour du
          profilage ou de la publicité.
        </p>
      </Block>
      <Block title="Vos droits">
        <p>
          Vous disposez des droits d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité (articles 15 à 22 du RGPD). Pour les
          exercer : <Mail /> — réponse sous un mois.
        </p>
        <p>En cas de désaccord, vous pouvez saisir la CNIL : <Ext href="https://www.cnil.fr">cnil.fr</Ext>.</p>
      </Block>
    </LegalShell>
  )
}

export function Cgu() {
  return (
    <LegalShell
      title="Conditions d’utilisation"
      intro={<p>Les présentes conditions générales d’utilisation (CGU) s’appliquent au site <strong>enginepc.heiphaistos.org</strong>.</p>}
    >
      <Block title="Objet">
        <p>
          EnginePC est un configurateur gratuit : il propose des configurations (PC, serveurs, NAS, portables, smartphones), vérifie la compatibilité, estime les
          performances et affiche des prix indicatifs.
        </p>
      </Block>
      <Block title="Acceptation">
        <p>Utiliser ce site vaut acceptation des présentes conditions. Si vous ne les acceptez pas, merci de ne pas l’utiliser.</p>
      </Block>
      <Block title="Gratuité">
        <p>Le service est <strong>entièrement gratuit</strong> : ni compte, ni abonnement, ni publicité.</p>
      </Block>
      <Block title="Nature des résultats">
        <p>
          Les configurations, compatibilités, performances et prix sont fournis à titre indicatif. Vérifiez les caractéristiques et le prix auprès du marchand
          avant tout achat. Les devis générés sont des documents de travail sans valeur contractuelle de la part de l’éditeur.
        </p>
      </Block>
      <Block title="Disponibilité et responsabilité">
        <p>
          Le site est fourni sans garantie de disponibilité ni d’exactitude. L’éditeur peut le modifier, le suspendre ou l’arrêter à tout moment, et ne pourra
          être tenu responsable des dommages directs ou indirects résultant de son utilisation, notamment d’un achat effectué sur la base de ses résultats.
        </p>
      </Block>
      <Block title="Comportement">
        <p>Il est interdit de tenter de porter atteinte à la sécurité ou à la disponibilité du site (attaque, aspiration massive, contournement des protections).</p>
      </Block>
      <Block title="Modification des conditions">
        <p>Ces conditions peuvent évoluer ; la date de dernière mise à jour figure en haut de page.</p>
      </Block>
      <Block title="Droit applicable">
        <p>Les présentes conditions sont régies par le droit français. En cas de litige, une solution amiable sera recherchée avant toute action.</p>
      </Block>
      <Block title="Contact">
        <p><Mail /></p>
      </Block>
    </LegalShell>
  )
}
