// Seeds content/* with initial markdown files from the design data.
// Run with: node scripts/seed.mjs
import fs from "node:fs";
import path from "node:path";

const root = path.resolve("src/content");

const SERVICES = [
  { id:"doublage", icon:"mic", num:"01", title:"Doublage", tag:"Flagship", short:"Rendre le contenu accessible dans les langues natales sans sous-titres.", long:"Notre service de doublage couvre le remplacement complet du dialogue original. De la direction artistique au mixage final, nous orchestrons chaque étape avec plus de 150 comédiens voix professionnels natifs.", facts:[{k:"Langues",v:"FR · AR (MSA & dialectal) · EN"},{k:"Délai",v:"24-48h projets courts"},{k:"Qualité",v:"92% de retours positifs"},{k:"Devis",v:"Gratuit & personnalisé"}] },
  { id:"voice-over", icon:"headphones", num:"02", title:"Voice-Over", short:"Narration pour documentaires, publicités et médias.", long:"Une voix juste, une intention claire. Notre casting couvre tous les registres — sobre, chaleureux, percutant, institutionnel.", facts:[{k:"Usage",v:"Doc · pub · corporate · e-learning"},{k:"Voix",v:"150+ comédiens castés"},{k:"Formats",v:"WAV · MP3 · AAF · OMF"},{k:"Livraison",v:"48h standard"}] },
  { id:"audio-description", icon:"eye", num:"03", title:"Audio-Description", short:"Accessibilité pour les audiences malvoyantes.", long:"Script, enregistrement et mixage conforme aux standards CSA pour rendre vos contenus accessibles.", facts:[{k:"Conformité",v:"Standards CSA France"},{k:"Langues",v:"FR · AR · EN"},{k:"Livrables",v:"Piste AD séparée ou mixée"},{k:"Support",v:"Film · série · doc · corporate"}] },
  { id:"transcription", icon:"subtitles", num:"04", title:"Transcription", short:"Conversion du langage parlé en texte écrit.", long:"Transcription 100% humaine avec timecode, time-stamping et relecture par un second linguiste.", facts:[{k:"Formats",v:"SRT · VTT · TXT · DOCX"},{k:"Précision",v:"99.2% verbatim"},{k:"Volume",v:"Jusqu'à 50h/semaine"},{k:"Délai",v:"24-72h selon durée"}] },
  { id:"traduction", icon:"translate", num:"05", title:"Traduction", short:"Adaptation de contenu entre langues.", long:"Adaptation — pas juste traduction. Nos linguistes natifs respectent le rythme, l'intention, la culture et les contraintes de synchronisation labiale.", facts:[{k:"Paires",v:"FR↔AR · EN↔FR · EN↔AR"},{k:"Spécialités",v:"Cinéma · corporate · IVR"},{k:"Certifiée",v:"Traducteurs assermentés"},{k:"Contrôle",v:"Double relecture systématique"}] },
  { id:"sous-titrage", icon:"subtitles", num:"06", title:"Sous-titrage", short:"Sous-titres multilingues, broadcast-ready.", long:"Sous-titrage, adaptation, incrustation. Export SRT, VTT, STL, EBU.", facts:[{k:"Formats",v:"SRT · VTT · STL · EBU"},{k:"Normes",v:"Netflix · Amazon · broadcast"},{k:"Langues",v:"10+ langues"},{k:"Incrust.",v:"Optionnelle"}] },
  { id:"spots", icon:"megaphone", num:"07", title:"Spots publicitaires", short:"Production de spots radio et vidéo.", long:"De l'écriture au master. Voix, musique, bruitage, mixage — prêts pour antenne.", facts:[{k:"Durées",v:"15s · 30s · 45s · 60s"},{k:"Livraison",v:"Masters broadcast"},{k:"Langues",v:"Multi-versions"},{k:"Délai",v:"5 à 10 jours"}] },
  { id:"corporate", icon:"building", num:"08", title:"Films Corporate", short:"Communication institutionnelle.", long:"Films d'entreprise, rapports annuels, vidéos internes, présentations commerciales.", facts:[{k:"Formats",v:"1 à 15 min"},{k:"Services",v:"Écriture · prod · post"},{k:"Résolution",v:"Jusqu'à 4K HDR"},{k:"Multi",v:"Tous supports"}] },
  { id:"ivr", icon:"phone", num:"09", title:"Serveur Vocal (IVR)", short:"Systèmes vocaux interactifs.", long:"Enregistrement des messages IVR pour standards téléphoniques, musique d'attente et annonces.", facts:[{k:"Voix",v:"Multiples timbres disponibles"},{k:"Langues",v:"FR · AR · EN"},{k:"Formats",v:"WAV 8k/16k · μ-law · A-law"},{k:"Update",v:"Modifications rapides"}] },
  { id:"post-production", icon:"clapper", num:"10", title:"Post-Production", short:"Assemblage audio/vidéo.", long:"Montage, sound design, mixage, étalonnage. Studios Pro Tools & Resolve.", facts:[{k:"Formats",v:"Cinéma · broadcast · web"},{k:"Livraison",v:"Masters tous formats"},{k:"Mix",v:"Stéréo · 5.1 · Atmos"},{k:"Couleur",v:"HDR · SDR"}] },
  { id:"export", icon:"globe", num:"11", title:"Export Digital", short:"Distribution internationale.", long:"Conformations plateformes : Netflix, Amazon, YouTube, diffuseurs TV.", facts:[{k:"Plateformes",v:"Netflix · Amazon · YouTube"},{k:"QC",v:"Contrôle qualité inclus"},{k:"DCP",v:"Cinéma numérique"},{k:"Metadata",v:"Packaging complet"}] },
  { id:"drone", icon:"drone", num:"12", title:"Drone", short:"Captation aérienne.", long:"Pilotes certifiés, images cinéma jusqu'à 6K HDR. Licence drone professionnelle Maroc.", facts:[{k:"Licence",v:"Drone pro MA certifié"},{k:"Caméra",v:"6K HDR · 10-bit"},{k:"Zones",v:"Maroc · autorisations spéciales"},{k:"Équipe",v:"Pilote + cadreur"}] }
];

const PROJECTS = [
  { id:"bricklayer", title:"The Bricklayer", kind:"Film", year:2024, lang:"FR/AR", tags:["Doublage","Post-Production"], desc:"Film d'action / thriller doublé en français et arabe.", seed:12, dur:"1h 42m", featured:true },
  { id:"qoloob-taeha", title:"Qoloob Taeha", kind:"Série", year:2024, lang:"AR", tags:["Doublage"], desc:"Série dramatique, 16 épisodes doublés.", seed:7, dur:"16 × 45m", featured:true },
  { id:"le-25-casablanca", title:"Le 25 Casablanca", kind:"Corporate", year:2023, lang:"FR/AR", tags:["Production","Post-Production"], desc:"Film institutionnel pour complexe résidentiel.", seed:19, dur:"4m 12s", featured:true },
  { id:"vert-marine", title:"Vert Marine", kind:"Corporate", year:2023, lang:"FR", tags:["Production"], desc:"Communication groupe — 3 vidéos.", seed:22, dur:"3 × 2m" },
  { id:"salah-fati", title:"Salah et Fati", kind:"Film", year:2023, lang:"AR", tags:["Doublage"], desc:"Comédie romantique, doublage FR.", seed:3, dur:"1h 38m" },
  { id:"au-revoir", title:"Au Revoir Mon Amour Trahi", kind:"Film", year:2023, lang:"AR", tags:["Doublage"], desc:"Drame romantique.", seed:15, dur:"1h 55m" },
  { id:"youth-fight", title:"Youth Fight", kind:"Film", year:2023, lang:"EN/FR", tags:["Doublage"], desc:"Drame sportif jeune public.", seed:28, dur:"1h 28m" },
  { id:"cbn-club", title:"CBN Club 700", kind:"Série", year:2023, lang:"EN/AR", tags:["Doublage"], desc:"Programme TV religieux, saison 4.", seed:9, dur:"24 × 60m" },
  { id:"almaz", title:"Almaz Quartier", kind:"Corporate", year:2023, lang:"FR", tags:["Production"], desc:"Film commercial immobilier.", seed:31, dur:"2m 40s" },
  { id:"church", title:"The Church of Dawn's Light", kind:"Film", year:2022, lang:"EN/AR", tags:["Doublage"], desc:"Drame historique.", seed:14, dur:"2h 08m" },
  { id:"ogsbc", title:"OGSBC", kind:"Projet", year:2022, lang:"FR", tags:["Doublage","Voice-Over"], desc:"Projet multi-épisodes.", seed:25, dur:"12 × 30m" },
  { id:"marketing-call", title:"Marketing Call Center", kind:"Corporate", year:2022, lang:"FR/AR", tags:["Voice-Over"], desc:"Scripts IVR bilingue.", seed:18, dur:"Varié" }
];

const STUDIOS = [
  { id:"A", name:"Studio A — Vocal Booth", spec:"Enregistrement vocal fermé, traitement acoustique intégral.", equip:["Neumann U87","UAD Apollo x8","KRK Rokit 8","Pro Tools HDX","Cabine traitée ±3dB"], surface:"18 m²", rt60:"0.18s" },
  { id:"B", name:"Studio B — Multi-Actors", spec:"Studio ouvert pour sessions de doublage multi-comédiens simultanés.", equip:["AKG C414","Presonus","Yamaha HS8","Audio-Technica M50x","8 micros simultanés"], surface:"34 m²", rt60:"0.24s" },
  { id:"C", name:"Studio C — Narration", spec:"Studio pour narrations longues, livres audio et podcasts.", equip:["Shure SM7B","Universal Audio 610","Presonus Monitors","Cabine 2m²"], surface:"12 m²", rt60:"0.16s" },
  { id:"D", name:"Studio D — Post-Production", spec:"Studio ouvert pour mixage, montage et étalonnage.", equip:["M-Audio","KRK Subwoofer","Pro Tools Ultimate","DaVinci Resolve Advanced"], surface:"28 m²", rt60:"0.22s" }
];

const POSTS = [
  { id:"formation-doublage", tag:"Formation", title:"Formation Doublage au Maroc", date:"3 avril 2026", excerpt:"Comment devenir comédien de doublage professionnel — parcours, techniques, débouchés.", read:"8 min" },
  { id:"secrets", tag:"Doublage", title:"Les secrets du doublage", date:"28 mars 2026", excerpt:"Comment adapter un dialogue sans trahir l'intention du comédien d'origine.", read:"6 min" },
  { id:"pouvoir-post", tag:"Post-Production", title:"Le pouvoir de la post-production", date:"15 mars 2026", excerpt:"La post-prod ne répare pas — elle révèle. 4 cas d'école sur des projets récents.", read:"10 min" },
  { id:"10-exercices", tag:"Voice-Over", title:"10 exercices pour le jeu vocal", date:"2 mars 2026", excerpt:"Échauffements et techniques de comédiens pour articuler, projeter, incarner.", read:"7 min" },
  { id:"tournage", tag:"Production", title:"Organiser un tournage corporate", date:"22 février 2026", excerpt:"Check-list, budgets et pièges à éviter pour un tournage institutionnel réussi.", read:"12 min" },
  { id:"ia", tag:"Technologie", title:"IA vs voix humaines", date:"14 février 2026", excerpt:"Où se trouve la frontière ? Notre position sur l'IA vocale et ses usages responsables.", read:"9 min" }
];

const FAQ = [
  { title:"Doublage", items:[
    { q:"Qu'est-ce que le doublage ?", a:"Le doublage consiste à remplacer les dialogues originaux d'un film, série ou contenu audiovisuel par une nouvelle piste vocale dans une autre langue." },
    { q:"Quelles langues proposez-vous ?", a:"Nous couvrons le français, l'arabe standard (MSA) et dialectal (marocain, levantin, égyptien), ainsi que l'anglais." },
    { q:"Quel délai de livraison ?", a:"Pour les projets courts (spots, extraits) : 24 à 48 heures. Pour un long-métrage : 2 à 4 semaines selon la complexité." }
  ]},
  { title:"Transcription", items:[
    { q:"Quels formats acceptés ?", a:"Nous livrons en SRT, VTT, TXT, DOCX et CSV." },
    { q:"Transcription 100% humaine ?", a:"Oui. Nos transcriptions sont réalisées et relues par deux linguistes natifs. Précision verbatim supérieure à 99%." }
  ]},
  { title:"Traduction", items:[
    { q:"Traduction certifiée ?", a:"Nous travaillons avec des traducteurs assermentés pour tout document juridique ou administratif." },
    { q:"Comment est la qualité assurée ?", a:"Chaque traduction passe par un second linguiste pour relecture." }
  ]},
  { title:"Spots & Corporate", items:[
    { q:"Durée max d'un spot ?", a:"Standard : 15, 30, 45 ou 60 secondes. Nous pouvons produire des formats non-standards." },
    { q:"Films corporate ?", a:"Oui, de la pré-production à la livraison." }
  ]}
];

function yaml(obj, depth = 0) {
  const pad = "  ".repeat(depth);
  let out = "";
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      out += `${pad}${k}:\n`;
      for (const item of v) {
        if (typeof item === "object") {
          const entries = Object.entries(item);
          out += `${pad}  - ${entries[0][0]}: ${JSON.stringify(entries[0][1])}\n`;
          for (let i = 1; i < entries.length; i++) out += `${pad}    ${entries[i][0]}: ${JSON.stringify(entries[i][1])}\n`;
        } else out += `${pad}  - ${JSON.stringify(item)}\n`;
      }
    } else if (typeof v === "object") {
      out += `${pad}${k}:\n` + yaml(v, depth + 1);
    } else {
      out += `${pad}${k}: ${JSON.stringify(v)}\n`;
    }
  }
  return out;
}

function write(dir, items, extraBody = () => "") {
  const full = path.join(root, dir);
  fs.mkdirSync(full, { recursive: true });
  items.forEach((item, i) => {
    const data = { ...item, order: i + 1 };
    const md = `---\n${yaml(data)}---\n\n${extraBody(item)}`;
    fs.writeFileSync(path.join(full, `${item.id || item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`), md);
  });
}

write("services", SERVICES, s => s.long || "");
write("projects", PROJECTS, p => p.desc || "");
write("posts", POSTS, p => `\n## ${p.title}\n\n${p.excerpt}\n\n*Article en cours de rédaction.*\n`);
write("studios", STUDIOS, s => s.spec);
write("faq", FAQ);

console.log("✓ Seeded content");
