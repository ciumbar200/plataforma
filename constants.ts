import {
  User, UserRole, RentalGoal, Property, PropertyType, OwnerStats,
  Notification, NotificationType, SavedSearch, BlogPost
} from './types';

export const CITIES_DATA: { [key: string]: string[] } = {
  'Madrid': [
    'Todas las localidades',
    'Acebeda (La)', 'Ajalvir', 'Alameda del Valle', 'Álamo (El)', 'Alcalá de Henares', 'Alcobendas', 'Alcorcón', 'Aldea del Fresno', 'Algete', 'Alpedrete', 'Ambite', 'Anchuelo', 'Aranjuez', 'Arganda del Rey', 'Arroyomolinos', 'Atazar (El)', 'Batres', 'Becerril de la Sierra', 'Belmonte de Tajo', 'Berrueco (El)', 'Berzosa del Lozoya', 'Boadilla del Monte', 'Boalo (El)', 'Braojos de la Sierra', 'Brea de Tajo', 'Brunete', 'Buitrago del Lozoya', 'Bustarviejo', 'Cabanillas de la Sierra', 'Cabrera (La)', 'Cadalso de los Vidrios', 'Camarma de Esteruelas', 'Campo Real', 'Canencia', 'Carabaña', 'Casarrubuelos', 'Cenicientos', 'Cercedilla', 'Cervera de Buitrago', 'Chapinería', 'Chinchón', 'Ciempozuelos', 'Cobeña', 'Collado Mediano', 'Collado Villalba', 'Colmenar de Oreja', 'Colmenar del Arroyo', 'Colmenar Viejo', 'Colmenarejo', 'Corpa', 'Coslada', 'Cubas de la Sagra', 'Daganzo de Arriba', 'Escorial (El)', 'Estremera', 'Fresnedillas de la Oliva', 'Fresno de Torote', 'Fuenlabrada', 'Fuente el Saz de Jarama', 'Fuentidueña de Tajo', 'Galapagar', 'Garganta de los Montes', 'Gargantilla del Lozoya y Pinilla de Buitrago', 'Gascones', 'Getafe', 'Griñón', 'Guadalix de la Sierra', 'Guadarrama', 'Hiruela (La)', 'Horcajo de la Sierra-Aoslos', 'Horcajuelo de la Sierra', 'Hoyo de Manzanares', 'Humanes de Madrid', 'Leganés', 'Loeches', 'Lozoya', 'Lozoyuela-Navas-Sieteiglesias', 'Madarcos', 'Madrid', 'Majadahonda', 'Manzanares el Real', 'Meco', 'Mejorada del Campo', 'Miraflores de la Sierra', 'Molar (El)', 'Molinos (Los)', 'Montejo de la Sierra', 'Moraleja de Enmedio', 'Moralzarzal', 'Morata de Tajuña', 'Móstoles', 'Navacerrada', 'Navalafuente', 'Navalagamella', 'Navalcarnero', 'Navarredonda y San Mamés', 'Navas del Rey', 'Nuevo Baztán', 'Olmeda de las Fuentes', 'Orusco de Tajuña', 'Paracuellos de Jarama', 'Parla', 'Patones', 'Pedrezuela', 'Pelayos de la Presa', 'Perales de Tajuña', 'Pezuela de las Torres', 'Pinilla del Valle', 'Pinto', 'Piñuécar-Gandullas', 'Pozuelo de Alarcón', 'Pozuelo del Rey', 'Prádena del Rincón', 'Puebla de la Sierra', 'Puentes Viejas', 'Quijorna', 'Rascafría', 'Redueña', 'Ribatejada', 'Rivas-Vaciamrid', 'Robledillo de la Jara', 'Robledo de Chavela', 'Robregordo', 'Rozas de Madrid (Las)', 'Rozas de Puerto Real', 'San Agustín del Guadalix', 'San Fernando de Henares', 'San Lorenzo de El Escorial', 'San Martín de la Vega', 'San Martín de Valdeiglesias', 'San Sebastián de los Reyes', 'Santa María de la Alameda', 'Santorcaz', 'Santos de la Humosa (Los)', 'Serna del Monte (La)', 'Serranillos del Valle', 'Sevilla la Nueva', 'Somosierra', 'Soto del Real', 'Talamanca de Jarama', 'Tielmes', 'Titulcia', 'Torrejón de Ardoz', 'Torrejón de la Calzada', 'Torrejón de Velasco', 'Torrelaguna', 'Torrelodones', 'Torremocha de Jarama', 'Torres de la Alameda', 'Tres Cantos', 'Valdaracete', 'Valdeavero', 'Valdelaguna', 'Valdemanco', 'Valdemaqueda', 'Valdemorillo', 'Valdemoro', 'Valdeolmos-Alalpardo', 'Valdepiélagos', 'Valdetorres de Jarama', 'Valdilecha', 'Valverde de Alcalá', 'Velilla de San Antonio', 'Vellón (El)', 'Venturada', 'Villa del Prado', 'Villaconejos', 'Villalbilla', 'Villamanrique de Tajo', 'Villamanta', 'Villamantilla', 'Villanueva de la Cañada', 'Villanueva de Perales', 'Villanueva del Pardillo', 'Villar del Olmo', 'Villarejo de Salvanés', 'Villaviciosa de Odón', 'Villavieja del Lozoya', 'Zarzalejo'
  ],
  'Barcelona': [
    'Todas las localidades',
    'Abrera', 'Aguilar de Segarra', 'Aiguafreda', 'Alella', 'Alpens', 'Ametlla del Vallès (L\')', 'Arenys de Mar', 'Arenys de Munt', 'Argençola', 'Argentona', 'Artés', 'Avià', 'Avinyó', 'Avinyonet del Penedès', 'Badalona', 'Badia del Vallès', 'Bagà', 'Balenyà', 'Balsareny', 'Barberà del Vallès', 'Barcelona', 'Begues', 'Bellprat', 'Berga', 'Bigues i Riells', 'Borredà', 'Bruc (El)', 'Brull (El)', 'Cabanyes (Les)', 'Cabrera d\'Anoia', 'Cabrera de Mar', 'Cabrils', 'Calaf', 'Calders', 'Caldes d\'Estrac', 'Caldes de Montbui', 'Calella', 'Calldetenes', 'Callús', 'Calonge de Segarra', 'Campins', 'Canet de Mar', 'Canovelles', 'Cànoves i Samalús', 'Canyelles', 'Capellades', 'Capolat', 'Cardedeu', 'Cardona', 'Carme', 'Casserres', 'Castell de l\'Areny', 'Castellar de n\'Hug', 'Castellar del Riu', 'Castellar del Vallès', 'Castellbell i el Vilar', 'Castellbisbal', 'Castellcir', 'Castelldefels', 'Castellet i la Gornal', 'Castellfollit de Riubregós', 'Castellfollit del Boix', 'Castellgalí', 'Castellnou de Bages', 'Castellolí', 'Castellterçol', 'Castellví de la Marca', 'Castellví de Rosanes', 'Centelles', 'Cercs', 'Cerdanyola del Vallès', 'Cervelló', 'Collbató', 'Collsuspina', 'Copons', 'Corbera de Llobregat', 'Cornellà de Llobregat', 'Cubelles', 'Dosrius', 'Esparreguera', 'Esplugues de Llobregat', 'Espunyola (L\')', 'Estany (L\')', 'Figaró-Montmany', 'Fígols', 'Fogars de la Selva', 'Fogars de Montclús', 'Folgueroles', 'Fonollosa', 'Font-rubí', 'Franqueses del Vallès (Les)', 'Gaià', 'Gallifa', 'Garriga (La)', 'Gavà', 'Gelida', 'Gironella', 'Gisclareny', 'Granada (La)', 'Granera', 'Granollers', 'Gualba', 'Guardiola de Berguedà', 'Gurb', 'Hospitalet de Llobregat (L\')', 'Hostalets de Pierola (Els)', 'Igualada', 'Jorba', 'Llacuna (La)', 'Llagosta (La)', 'Lliçà d\'Amunt', 'Lliçà de Vall', 'Llinars del Vallès', 'Lluçà', 'Malgrat de Mar', 'Malla', 'Manlleu', 'Manresa', 'Marganell', 'Martorell', 'Martorelles', 'Masies de Roda (Les)', 'Masies de Voltregà (Les)', 'Masnou (El)', 'Masquefa', 'Matadepera', 'Mataró', 'Mediona', 'Moià', 'Molins de Rei', 'Mollet del Vallès', 'Monistrol de Calders', 'Monistrol de Montserrat', 'Montcada i Reixac', 'Montclar', 'Montesquiu', 'Montgat', 'Montmajor', 'Montmaneu', 'Montmeló', 'Montornès del Vallès', 'Montseny', 'Muntanyola', 'Mura', 'Navarcles', 'Navàs', 'Nou de Berguedà (La)', 'Òdena', 'Olèrdola', 'Olesa de Bonesvalls', 'Olesa de Montserrat', 'Olivella', 'Olost', 'Olvan', 'Orís', 'Oristà', 'Orpí', 'Òrrius', 'Pacs del Penedès', 'Palafolls', 'Palau-solità i Plegamans', 'Pallejà', 'Palma de Cervelló (La)', 'Papiol (El)', 'Paredes del Vallès', 'Parets del Vallès', 'Perafita', 'Piera', 'Pineda de Mar', 'Pla del Penedès (El)', 'Pobla de Claramunt (La)', 'Pobla de Lillet (La)', 'Polinyà', 'Pont de Vilomara i Rocafort (El)', 'Pontons', 'Prat de Llobregat (El)', 'Prats de Lluçanès', 'Prats de Rei (Els)', 'Premià de Dalt', 'Premià de Mar', 'Puigdàlber', 'Puig-reig', 'Pujalt', 'Quar (La)', 'Rajadell', 'Rellinars', 'Ripollet', 'Roca del Vallès (La)', 'Roda de Ter', 'Rubí', 'Rubió', 'Rupit i Pruit', 'Sabadell', 'Sagàs', 'Saldes', 'Sallent', 'Sant Adrià de Besòs', 'Sant Agustí de Lluçanès', 'Sant Andreu de la Barca', 'Sant Andreu de Llavaneres', 'Sant Antoni de Vilamajor', 'Sant Bartomeu del Grau', 'Sant Boi de Llobregat', 'Sant Boi de Lluçanès', 'Sant Cebrià de Vallalta', 'Sant Celoni', 'Sant Climent de Llobregat', 'Sant Cugat del Vallès', 'Sant Cugat Sesgarrigues', 'Sant Esteve de Palautordera', 'Sant Esteve Sesrovires', 'Sant Feliu de Codines', 'Sant Feliu de Llobregat', 'Sant Feliu Sasserra', 'Sant Fost de Campsentelles', 'Sant Fruitós de Bages', 'Sant Hipòlit de Voltregà', 'Sant Iscle de Vallalta', 'Sant Jaume de Frontanyà', 'Sant Joan de Vilatorrada', 'Sant Joan Despí', 'Sant Julià de Cerdanyola', 'Sant Julià de Vilatorta', 'Sant Just Desvern', 'Sant Llorenç d\'Hortons', 'Sant Llorenç Savall', 'Sant Martí d\'Albars', 'Sant Martí de Centelles', 'Sant Martí de Tous', 'Sant Martí Sarroca', 'Sant Martí Sesgueioles', 'Sant Mateu de Bages', 'Sant Pere de Ribes', 'Sant Pere de Riudebitlles', 'Sant Pere de Torelló', 'Sant Pere de Vilamajor', 'Sant Pere Sallavinera', 'Sant Pol de Mar', 'Sant Quintí de Mediona', 'Sant Quirze de Besora', 'Sant Quirze del Vallès', 'Sant Quirze Safaja', 'Sant Sadurní d\'Anoia', 'Sant Sadurní d\'Osormort', 'Sant Salvador de Guardiola', 'Sant Vicenç de Castellet', 'Sant Vicenç de Montalt', 'Sant Vicenç de Torelló', 'Sant Vicenç dels Horts', 'Santa Cecília de Voltregà', 'Santa Coloma de Cervelló', 'Santa Coloma de Gramenet', 'Santa Eugènia de Berga', 'Santa Eulàlia de Riuprimer', 'Santa Eulàlia de Ronçana', 'Santa Fe del Penedès', 'Santa Margarida de Montbui', 'Santa Margarida i els Monjos', 'Santa Maria de Besora', 'Santa Maria de Corcó', 'Santa Maria de Martorelles', 'Santa Maria de Merlès', 'Santa Maria de Miralles', 'Santa Maria d\'Oló', 'Santa Maria de Palautordera', 'Santa Perpètua de Mogoda', 'Santa Susanna', 'Santpedor', 'Sentmenat', 'Seva', 'Sitges', 'Sobremunt', 'Sora', 'Subirats', 'Súria', 'Tagamanent', 'Talamanca', 'Taradell', 'Tavèrnoles', 'Tavertet', 'Teià', 'Terrassa', 'Tiana', 'Tona', 'Tordera', 'Torelló', 'Torre de Claramunt (La)', 'Torrelavit', 'Torrelles de Foix', 'Torrelles de Llobregat', 'Ullastrell', 'Vacarisses', 'Vallbona d\'Anoia', 'Vallcebre', 'Vallgorguina', 'Vallirana', 'Vallromanes', 'Veciana', 'Vic', 'Vilada', 'Viladecavalls', 'Viladecans', 'Vilanova de Sau', 'Vilanova del Camí', 'Vilanova del Vallès', 'Vilanova i la Geltrú', 'Vilassar de Dalt', 'Vilassar de Mar', 'Vilobí del Penedès', 'Vinyols i els Arcs'
  ],
  'Valencia': [
    'Todas las localidades',
    'Ademuz', 'Ador', 'Agullent', 'Aielo de Malferit', 'Aielo de Rugat', 'Alaquàs', 'Albaida', 'Albal', 'Albalat de la Ribera', 'Albalat dels Sorells', 'Albalat dels Tarongers', 'Alberic', 'Alborache', 'Alboraya', 'Albuixech', 'Alcàntera de Xúquer', 'Alcàsser', 'Alcublas', 'Aldaia', 'Alfafar', 'Alfara de la Baronia', 'Alfara del Patriarca', 'Alfarp', 'Alfarrasí', 'Alfauir', 'Algar de Palancia', 'Algemesí', 'Algimia de Alfara', 'Alginet', 'Almàssera', 'Almiserà', 'Almoines', 'Almussafes', 'Alpuente', 'Alqueria de la Comtessa (l\')', 'Alzira', 'Andilla', 'Anna', 'Antella', 'Aras de los Olmos', 'Atzeneta d\'Albaida', 'Ayora', 'Barx', 'Barxeta', 'Bèlgida', 'Bellreguard', 'Bellús', 'Benagéber', 'Benaguasil', 'Benavites', 'Beneixida', 'Benetússer', 'Beniarjó', 'Beniatjar', 'Benicolet', 'Benicull de Xúquer', 'Benifaió', 'Benifairó de la Valldigna', 'Benifairó de les Valls', 'Beniflá', 'Benigànim', 'Benimodo', 'Benimuslem', 'Beniparrell', 'Benirredrà', 'Benissanó', 'Benissoda', 'Benissuera', 'Bétera', 'Bicorp', 'Bocairent', 'Bolbaite', 'Bonrepòs i Mirambell', 'Bufali', 'Bugarra', 'Buñol', 'Burjassot', 'Calles', 'Camporrobles', 'Canals', 'Canet d\'En Berenguer', 'Carcaixent', 'Càrcer', 'Carlet', 'Carrícola', 'Casas Altas', 'Casas Bajas', 'Casinos', 'Castelló de Rugat', 'Castellonet de la Conquesta', 'Castielfabib', 'Catadau', 'Catarroja', 'Caudete de las Fuentes', 'Cerdà', 'Chella', 'Chelva', 'Chera', 'Chest', 'Chiva', 'Chulilla', 'Cofrentes', 'Corbera', 'Cortes de Pallás', 'Cotes', 'Cullera', 'Daimús', 'Domeño', 'Dos Aguas', 'Eliana (l\')', 'Emperador', 'Enguera', 'Ènova (l\')', 'Estivella', 'Estubeny', 'Faura', 'Favara', 'Foios', 'Font de la Figuera (la)', 'Font d\'En Carròs (la)', 'Fontanars dels Alforins', 'Fortaleny', 'Fuenterrobles', 'Gandia', 'Gátova', 'Gavarda', 'Genovés', 'Gestalgar', 'Gilet', 'Godella', 'Godelleta', 'Granja de la Costera (la)', 'Guadasséquies', 'Guadassuar', 'Guardamar de la Safor', 'Higueruelas', 'Jalance', 'Jarafuel', 'Llanera de Ranes', 'Llaurí', 'Llíria', 'Llocnou de la Corona', 'Llocnou de Sant Jeroni', 'Llocnou d\'En Fenollet', 'Llombai', 'Llosa de Ranes (la)', 'Llutxent', 'Loriguilla', 'Losa del Obispo', 'Macastre', 'Manises', 'Manuel', 'Marines', 'Massalavés', 'Massalfassar', 'Massamagrell', 'Massanassa', 'Meliana', 'Millares', 'Miramar', 'Mislata', 'Mogente', 'Moncada', 'Montserrat', 'Montaverner', 'Montesa', 'Montitxelvo', 'Montroy', 'Museros', 'Náquera', 'Navarrés', 'Novelé', 'Oliva', 'Olocau', 'Olleria (l\')', 'Ontinyent', 'Otos', 'Paiporta', 'Palma de Gandía', 'Palmera', 'Palomar (el)', 'Paterna', 'Pedralba', 'Petrés', 'Picanya', 'Picassent', 'Piles', 'Pinet', 'Pobla de Farnals (la)', 'Pobla de Vallbona (la)', 'Pobla del Duc (la)', 'Pobla Llarga (la)', 'Polinyà de Xúquer', 'Potries', 'Puçol', 'Puebla de San Miguel', 'Puig de Santa Maria', 'Quart de les Valls', 'Quart de Poblet', 'Quartell', 'Quatretonda', 'Quesa', 'Rafelbunyol', 'Rafelcofer', 'Rafelguaraf', 'Ráfol de Salem', 'Real', 'Real de Gandía', 'Requena', 'Riba-roja de Túria', 'Riola', 'Rocafort', 'Rotglà i Corberà', 'Rótova', 'Rugat', 'Sagunto', 'Salem', 'San Antonio de Benagéber', 'Sant Joanet', 'Sedaví', 'Segart', 'Sellent', 'Sempere', 'Senyera', 'Serra', 'Siete Aguas', 'Silla', 'Simat de la Valldigna', 'Sinarcas', 'Sollana', 'Sot de Chera', 'Sueca', 'Sumacàrcer', 'Tavernes Blanques', 'Tavernes de la Valldigna', 'Teresa de Cofrentes', 'Terrateig', 'Titaguas', 'Torrebaja', 'Torrella', 'Torrent', 'Torres Torres', 'Tous', 'Tuéjar', 'Turís', 'Utiel', 'Valencia', 'Vallada', 'Vallanca', 'Vallés', 'Venta del Moro', 'Vilamarxant', 'Villalonga', 'Villar del Arzobispo', 'Villargordo del Cabriel', 'Vinalesa', 'Xàtiva', 'Xeraco', 'Xeresa', 'Xirivella', 'Yátova', 'Yesa (la)', 'Zarra'
  ],
  'Sevilla': [
    'Todas las localidades',
    'Aguadulce', 'Alanís', 'Albaida del Aljarafe', 'Alcalá de Guadaíra', 'Alcalá del Río', 'Alcolea del Río', 'Algaba (La)', 'Algámitas', 'Almadén de la Plata', 'Almensilla', 'Arahal', 'Aznalcázar', 'Aznalcóllar', 'Badolatosa', 'Benacazón', 'Bollullos de la Mitación', 'Bormujos', 'Brenes', 'Burguillos', 'Cabezas de San Juan (Las)', 'Camas', 'Campana (La)', 'Cantillana', 'Cañada Rosal', 'Carmona', 'Carrión de los Céspedes', 'Casariche', 'Castilblanco de los Arroyos', 'Castilleja de Guzmán', 'Castilleja de la Cuesta', 'Castilleja del Campo', 'Castillo de las Guardas (El)', 'Cazalla de la Sierra', 'Constantina', 'Coria del Río', 'Coripe', 'Coronil (El)', 'Corrales (Los)', 'Cuervo de Sevilla (El)', 'Dos Hermanas', 'Écija', 'Espartinas', 'Estepa', 'Fuentes de Andalucía', 'Garrobo (El)', 'Gelves', 'Gerena', 'Gilena', 'Gines', 'Guadalcanal', 'Guillena', 'Herrera', 'Huévar del Aljarafe', 'Isla Mayor', 'Lantejuela (La)', 'Lebrija', 'Lora de Estepa', 'Lora del Río', 'Luisiana (La)', 'Madroño (El)', 'Mairena del Alcor', 'Mairena del Aljarafe', 'Marchena', 'Marinaleda', 'Martín de la Jara', 'Molares (Los)', 'Montellano', 'Morón de la Frontera', 'Navas de la Concepción (Las)', 'Olivares', 'Osuna', 'Palacios y Villafranca (Los)', 'Palomares del Río', 'Paradas', 'Pedrera', 'Pedroso (El)', 'Peñaflor', 'Pilas', 'Pruna', 'Puebla de Cazalla (La)', 'Puebla de los Infantes (La)', 'Puebla del Río (La)', 'Real de la Jara (El)', 'Rinconada (La)', 'Roda de Andalucía (La)', 'Ronquillo (El)', 'Rubio (El)', 'Salteras', 'San Juan de Aznalfarache', 'San Nicolás del Puerto', 'Sanlúcar la Mayor', 'Santiponce', 'Saucejo (El)', 'Sevilla', 'Tocina', 'Tomares', 'Umbrete', 'Utrera', 'Valencina de la Concepción', 'Villamanrique de la Condesa', 'Villanueva de San Juan', 'Villanueva del Ariscal', 'Villanueva del Río y Minas', 'Villaverde del Río', 'Viso del Alcor (El)'
  ],
};

export const showNotification = (title: string, options: NotificationOptions) => {
  if (!('Notification' in window)) {
    console.log('Este navegador no soporta notificaciones de escritorio');
  } else if (Notification.permission === 'granted') {
    new Notification(title, options);
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification(title, options);
      }
    });
  }
};

/**
 * Sends email data to a configured n8n webhook.
 * @param to The recipient's email address.
 * @param subject The email subject.
 * @param html The HTML body of the email.
 */
export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  // NOTE FOR DEPLOYMENT: This localhost URL will not work in production.
  // Replace with your production n8n webhook URL.
  // It is also highly recommended to move this to a serverless function (e.g., Supabase Edge Function)
  // to avoid exposing the webhook URL on the client-side.
  const webhookUrl = 'http://localhost:5678/webhook/9e4fb242-cbdd-47fb-b4d0-4c7053dcc8d6';

  try {
    const params = new URLSearchParams();
    params.append('to', to);
    params.append('subject', subject);
    params.append('html', html);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      console.error('La respuesta del webhook de n8n no fue exitosa:', response.statusText);
      const responseBody = await response.text();
      console.error('Cuerpo de la respuesta:', responseBody);
    } else {
      console.log('Datos del email enviados correctamente al webhook de n8n.');
    }
  } catch (error) {
    console.error('Error al enviar los datos del email a n8n:', error);
  }
};

/**
 * Adds a new contact to Fluent CRM via webhook.
 * @param user The user object containing contact details.
 */
export const addToFluentCRM = async (user: { name: string; lastName?: string; email?: string; role: UserRole }): Promise<void> => {
  // NOTE FOR DEPLOYMENT: This URL uses a raw IP and is likely for a development environment.
  // Replace with your production Fluent CRM webhook URL.
  // It is also highly recommended to move this to a serverless function for security.
  const webhookUrl = 'https://34.18.107.121/?fluentcrm=1&route=contact&hash=9081c320-d431-459a-baca-fbcad56b42d9';

  if (!user.email) {
    console.error('Fluent CRM: Email is required to add a contact.');
    return;
  }

  const payload = {
    first_name: user.name,
    last_name: user.lastName || '',
    email: user.email,
    tags: [user.role], // Use the role as a tag
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('La respuesta del webhook de Fluent CRM no fue exitosa:', response.statusText);
      const responseBody = await response.text();
      console.error('Cuerpo de la respuesta:', responseBody);
    } else {
      console.log('Contacto enviado correctamente al webhook de Fluent CRM.');
    }
  } catch (error) {
    console.error('Error al enviar el contacto a Fluent CRM:', error);
  }
};

// --- MOCK DATA ---
export const MOCK_USERS: User[] = [
  {
    id: '1', name: 'Elena García', email: 'elena@example.com', age: 28, city: 'Madrid', locality: 'Malasaña', profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&fit=crop&crop=faces&facepad=4', interests: ['Yoga', 'Cocina Vegana', 'Viajar', 'Fotografía'], noiseLevel: 'Bajo', compatibility: 92, role: UserRole.INQUILINO, bio: 'Busco un espacio tranquilo y gente con buena energía para compartir piso. Soy diseñadora gráfica, me encanta el arte y los planes de día.', lifestyle: ['Diurno', 'Creativo', 'Tranquilo'], commuteDistance: 20, rentalGoal: RentalGoal.FIND_ROOM_WITH_ROOMMATES, isBanned: false,
  },
  {
    id: '2', name: 'Javier Moreno', email: 'javier@example.com', age: 31, city: 'Madrid', locality: 'Chamberí', profilePicture: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&h=200&fit=crop&crop=faces&facepad=4', interests: ['Senderismo', 'Música Indie', 'Cine', 'Salir de tapas'], noiseLevel: 'Medio', compatibility: 85, role: UserRole.INQUILINO, bio: 'Soy desarrollador de software y en mi tiempo libre me gusta descubrir la sierra de Madrid. Busco buen rollo y gente independiente.', lifestyle: ['Diurno', 'Social'], commuteDistance: 30, rentalGoal: RentalGoal.FIND_ROOM_WITH_ROOMMATES, isBanned: false,
  },
  {
    id: '3', name: 'Carlos Pérez', email: 'carlos@example.com', age: 34, city: 'Barcelona', locality: 'Gràcia', profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&h=200&fit=crop&crop=faces&facepad=4', interests: ['Arte Urbano', 'Videojuegos', 'Música en vivo'], noiseLevel: 'Medio', compatibility: 78, role: UserRole.PROPIETARIO, bio: 'Alquilo una habitación en mi piso de Gràcia. Soy una persona tranquila y trabajo desde casa. Busco a alguien limpio y respetuoso.', lifestyle: ['Diurno', 'Tranquilo'], commuteDistance: 10, isBanned: false,
  },
  {
    id: '4', name: 'Sofía López', email: 'sofia@example.com', age: 25, city: 'Barcelona', locality: 'Poblenou', profilePicture: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=200&h=200&fit=crop&crop=faces&facepad=4', interests: ['Música en vivo', 'Brunch', 'Pasear por la playa', 'Diseño'], noiseLevel: 'Bajo', compatibility: 0, role: UserRole.INQUILINO, bio: 'Recién llegada a Barcelona por trabajo. Me gusta la vida tranquila entre semana pero no digo que no a un buen plan de finde.', lifestyle: ['Creativo', 'Tranquilo'], commuteDistance: 15, rentalGoal: RentalGoal.FIND_ROOM_WITH_ROOMMATES, isBanned: false,
  },
  {
    id: '5', name: 'David Martín', email: 'david@example.com', age: 29, city: 'Madrid', locality: 'Retiro', profilePicture: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=200&h=200&fit=crop&crop=faces&facepad=4', interests: ['Deportes', 'Videojuegos', 'Series', 'Cerveza artesanal'], noiseLevel: 'Medio', compatibility: 0, role: UserRole.INQUILINO, bio: 'Ingeniero informático. Me paso el día programando así que necesito desconectar. Fan del Real Madrid y de cualquier deporte.', lifestyle: ['Social', 'Deportista'], commuteDistance: 40, rentalGoal: RentalGoal.FIND_ROOMMATES_AND_APARTMENT, isBanned: false,
  },
  {
    id: '6', name: 'Lucía Fernández', email: 'lucia@example.com', age: 27, city: 'Valencia', locality: 'Ruzafa', profilePicture: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&fit=crop&crop=faces&facepad=4', interests: ['Lectura', 'Teatro', 'Museos', 'Cocinar'], noiseLevel: 'Bajo', compatibility: 0, role: UserRole.INQUILINO, bio: 'Enfermera de profesión, tranquila por naturaleza. Necesito silencio para descansar por mis turnos. Me encanta leer y cocinar postres.', lifestyle: ['Diurno', 'Tranquilo', 'Intelectual'], commuteDistance: 25, rentalGoal: RentalGoal.FIND_ROOM_WITH_ROOMMATES, isBanned: false,
  },
  {
    id: '7', name: 'Marcos Ruiz', email: 'marcos@example.com', age: 22, city: 'Sevilla', locality: 'Triana', profilePicture: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=200&h=200&fit=crop&crop=faces&facepad=4', interests: ['Salir de tapas', 'Fútbol', 'Viajar', 'Fiestas'], noiseLevel: 'Alto', compatibility: 0, role: UserRole.INQUILINO, bio: 'Estudiante de ADE. Busco gente para compartir piso y pasarlo bien. Soy sociable y bastante ordenado, eso sí.', lifestyle: ['Nocturno', 'Social'], commuteDistance: 10, rentalGoal: RentalGoal.FIND_ROOMMATES_AND_APARTMENT, isBanned: false,
  },
  {
    id: '8', name: 'Paula Jiménez', email: 'paula@example.com', age: 30, city: 'Madrid', locality: 'Lavapiés', profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&fit=crop&crop=faces&facepad=4', interests: ['Arte Urbano', 'Fotografía', 'Cocina Vegana', 'Mercadillos'], noiseLevel: 'Medio', compatibility: 0, role: UserRole.INQUILINO, bio: 'Artista y activista. Busco un espacio inspirador con gente de mente abierta. El respeto y la comunicación son clave para mí.', lifestyle: ['Creativo', 'Eco-friendly'], commuteDistance: 20, rentalGoal: RentalGoal.BOTH, isBanned: false,
  },
  {
    id: '9', name: 'Adrián González', email: 'adrian@example.com', age: 33, city: 'Barcelona', locality: 'El Raval', profilePicture: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?q=80&w=200&h=200&fit=crop&crop=faces&facepad=4', interests: ['Cocinar', 'Música en vivo', 'Cine', 'Vino'], noiseLevel: 'Medio', compatibility: 0, role: UserRole.INQUILINO, bio: 'Soy chef, así que mis horarios son un poco locos, pero siempre hay algo rico en la nevera. Disfruto de una buena charla con una copa de vino.', lifestyle: ['Nocturno', 'Social'], commuteDistance: 30, rentalGoal: RentalGoal.FIND_ROOM_WITH_ROOMMATES, isBanned: false,
  },
  {
    id: '10', name: 'Isabel Romero', email: 'isabel@example.com', age: 35, city: 'Madrid', locality: 'Salamanca', profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&fit=crop&crop=faces&facepad=4', interests: ['Lectura', 'Yoga', 'Museos', 'Brunch'], noiseLevel: 'Bajo', compatibility: 0, role: UserRole.INQUILINO, bio: 'Escritora freelance. Trabajo desde casa, por lo que valoro mucho el silencio y el orden. Busco un ambiente relajado y maduro.', lifestyle: ['Diurno', 'Tranquilo', 'Intelectual'], commuteDistance: 45, rentalGoal: RentalGoal.FIND_ROOM_WITH_ROOMMATES, isBanned: false,
  },
  {
    id: '11', name: 'Hugo Navarro', email: 'hugo@example.com', age: 26, city: 'Valencia', locality: 'El Cabanyal', profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&fit=crop&crop=faces&facepad=4', interests: ['Fitness', 'Deportes', 'Senderismo', 'Nutrición'], noiseLevel: 'Medio', compatibility: 0, role: UserRole.INQUILINO, bio: 'Entrenador personal. Mi día empieza a las 6 AM. Busco compañeros con un estilo de vida activo y saludable. El orden es importante.', lifestyle: ['Diurno', 'Deportista'], commuteDistance: 15, rentalGoal: RentalGoal.FIND_ROOMMATES_AND_APARTMENT, isBanned: false,
  },
  {
    id: '12', name: 'Carmen Torres', email: 'carmen@example.com', age: 24, city: 'Barcelona', locality: 'Sants', profilePicture: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&h=200&fit=crop&crop=faces&facepad=4', interests: ['Música Indie', 'Tocar la guitarra', 'Series', 'Viajar'], noiseLevel: 'Medio', compatibility: 0, role: UserRole.INQUILINO, bio: 'Estudiante de música. A veces ensayo en casa, pero siempre a horas razonables. Busco gente maja con la que poder charlar de vez en cuando.', lifestyle: ['Creativo', 'Social'], commuteDistance: 20, rentalGoal: RentalGoal.FIND_ROOM_WITH_ROOMMATES, isBanned: false,
  },
  {
    id: '13', name: 'Daniel Ríos', email: 'daniel@example.com', age: 32, city: 'Madrid', locality: 'La Latina', profilePicture: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&h=200&fit=crop&crop=faces&facepad=4', interests: ['Perros', 'Salir de tapas', 'Fotografía', 'Senderismo'], noiseLevel: 'Medio', compatibility: 0, role: UserRole.INQUILINO, bio: 'Paseo perros y tengo un golden retriever adorable y muy bien educado. Busco un piso pet-friendly y compañeros que amen a los animales.', lifestyle: ['Diurno', 'Eco-friendly'], commuteDistance: 35, rentalGoal: RentalGoal.BOTH, isBanned: false,
  },
  {
    id: 'admin', name: 'Admin', email: 'admin@moon.com', age: 99, city: 'Internet', locality: 'The Cloud', profilePicture: 'https://placehold.co/100x100/7c3aed/ffffff?text=M', interests: [], noiseLevel: 'Medio', compatibility: 0, role: UserRole.ADMIN, bio: 'I am the administrator.', isBanned: false,
  }
];

export const MOCK_PROPERTIES: Property[] = [
    { id: 1, owner_id: '3', title: 'Habitación luminosa en Gràcia', address: 'Carrer de Verdi, 24', city: 'Barcelona', locality: 'Gràcia', postalCode: '08012', propertyType: PropertyType.ROOM, imageUrls: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop'], price: 550, visibility: 'Pública', views: 1204, compatibleCandidates: 18, conditions: 'Estancia mínima 6 meses. No fumadores.', features: { wifi: true, kitchen: true, washingMachine: true, furnished: true, petsAllowed: false }, availableFrom: '2024-08-01', lat: 41.4036, lng: 2.1545, status: 'approved', bathrooms: 1},
    { id: 2, owner_id: '3', title: 'Ático con terraza en Chamberí', address: 'Calle de Ponzano, 50', city: 'Madrid', locality: 'Chamberí', postalCode: '28003', propertyType: PropertyType.APARTMENT, imageUrls: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop'], price: 1400, visibility: 'Pública', views: 8560, compatibleCandidates: 120, conditions: 'Se requiere 2 meses de fianza.', features: { wifi: true, airConditioning: true, kitchen: true, washingMachine: true, elevator: true, balcony: true, petsAllowed: true }, availableFrom: '2024-09-01', lat: 40.4358, lng: -3.6974, status: 'approved', bathrooms: 2},
    { id: 3, owner_id: '3', title: 'Piso por Aprobar', address: 'Calle Falsa, 123', city: 'Madrid', locality: 'Centro', postalCode: '28001', propertyType: PropertyType.FLAT, imageUrls: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop'], price: 900, visibility: 'Pública', views: 0, compatibleCandidates: 0, availableFrom: '2024-08-15', lat: 40.4168, lng: -3.7038, status: 'pending', bathrooms: 1},
    { id: 4, owner_id: '3', title: 'Moderno apartamento en El Born', address: 'Carrer de la Princesa, 10', city: 'Barcelona', locality: 'Ciutat Vella', postalCode: '08003', propertyType: PropertyType.APARTMENT, imageUrls: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop'], price: 1250, visibility: 'Pública', views: 5620, compatibleCandidates: 85, conditions: 'Contrato de larga duración. Ideal para creativos.', features: { wifi: true, airConditioning: true, kitchen: true, furnished: true, balcony: true }, availableFrom: '2024-09-15', lat: 41.385, lng: 2.180, status: 'approved', bathrooms: 1 },
    { id: 5, owner_id: '3', title: 'Piso de lujo en Salamanca', address: 'Calle de Velázquez, 80', city: 'Madrid', locality: 'Salamanca', postalCode: '28001', propertyType: PropertyType.FLAT, imageUrls: ['https://images.unsplash.com/photo-1613553425599-6791b6b55355?q=80&w=800&auto=format&fit=crop'], price: 2800, visibility: 'Pública', views: 11200, compatibleCandidates: 45, conditions: 'Se requiere solvencia demostrable. No estudiantes.', features: { wifi: true, airConditioning: true, heating: true, kitchen: true, washingMachine: true, parking: true, elevator: true, doorman: true, petsAllowed: true }, availableFrom: '2024-10-01', lat: 40.426, lng: -3.683, status: 'approved', bathrooms: 3 },
    { id: 6, owner_id: '3', title: 'Casa con jardín en Nervión', address: 'Avenida de la Cruz del Campo, 25', city: 'Sevilla', locality: 'Nervión', postalCode: '41005', propertyType: PropertyType.HOUSE, imageUrls: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop'], price: 1800, visibility: 'Pública', views: 9300, compatibleCandidates: 95, conditions: 'Ideal para familias. Se admiten mascotas pequeñas.', features: { heating: true, kitchen: true, washingMachine: true, parking: true, petsAllowed: true, airConditioning: true }, availableFrom: '2024-08-20', lat: 37.382, lng: -5.970, status: 'approved', bathrooms: 2 },
    { id: 7, owner_id: '3', title: 'Loft diáfano en Ruzafa', address: 'Carrer de Sueca, 45', city: 'Valencia', locality: 'Ruzafa', postalCode: '46004', propertyType: PropertyType.STUDIO, imageUrls: ['https://images.unsplash.com/photo-1596203248833-31a02f8f4316?q=80&w=800&auto=format&fit=crop'], price: 850, visibility: 'Pública', views: 7150, compatibleCandidates: 150, conditions: 'Perfecto para una persona o pareja.', features: { wifi: true, airConditioning: true, kitchen: true, elevator: true, furnished: true }, availableFrom: '2024-11-01', lat: 39.462, lng: -0.373, status: 'approved', bathrooms: 1 },
    { id: 8, owner_id: '3', title: 'Piso bohemio en Lavapiés', address: 'Calle del Amparo, 70', city: 'Madrid', locality: 'Lavapiés', postalCode: '28012', propertyType: PropertyType.FLAT, imageUrls: ['https://images.unsplash.com/photo-1536338540129-23a4a036734c?q=80&w=800&auto=format&fit=crop'], price: 950, visibility: 'Pública', views: 4321, compatibleCandidates: 77, conditions: 'Se busca gente con mente abierta y buen rollo.', features: { wifi: true, kitchen: true, washingMachine: true, balcony: true }, availableFrom: '2024-09-05', lat: 40.408, lng: -3.701, status: 'approved', bathrooms: 1 },
    { id: 9, owner_id: '3', title: 'Apartamento con vistas en Eixample', address: 'Passeig de Gràcia, 92', city: 'Barcelona', locality: 'Eixample', postalCode: '08008', propertyType: PropertyType.APARTMENT, imageUrls: ['https://images.unsplash.com/photo-1605346435349-89a5e8c0b56a?q=80&w=800&auto=format&fit=crop'], price: 2100, visibility: 'Pública', views: 15000, compatibleCandidates: 60, conditions: 'Contrato mínimo de un año.', features: { wifi: true, airConditioning: true, heating: true, elevator: true, doorman: true, balcony: true }, availableFrom: '2025-01-01', lat: 41.395, lng: 2.162, status: 'approved', bathrooms: 2 },
    { id: 10, owner_id: '3', title: 'Casa adosada en Pozuelo', address: 'Calle de la Iglesia, 15', city: 'Madrid', locality: 'Pozuelo de Alarcón', postalCode: '28223', propertyType: PropertyType.HOUSE, imageUrls: ['https://images.unsplash.com/photo-1570129477492-45c003edd2e7?q=80&w=800&auto=format&fit=crop'], price: 2500, visibility: 'Privada', views: 2500, compatibleCandidates: 15, conditions: 'Solo perfiles verificados. Ideal para expatriados.', features: { pool: true, heating: true, parking: true, petsAllowed: true, gym: true }, availableFrom: '2024-09-01', lat: 40.434, lng: -3.812, status: 'approved', bathrooms: 4 },
    { id: 11, owner_id: '3', title: 'Estudio acogedor cerca de la playa', address: 'Carrer de la Reina, 200', city: 'Valencia', locality: 'El Cabanyal', postalCode: '46011', propertyType: PropertyType.STUDIO, imageUrls: ['https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800&auto=format&fit=crop'], price: 700, visibility: 'Pública', views: 6800, compatibleCandidates: 130, conditions: 'Disponible para el curso escolar.', features: { wifi: true, airConditioning: true, kitchen: true, furnished: true }, availableFrom: '2024-09-01', lat: 39.469, lng: -0.326, status: 'approved', bathrooms: 1 },
    { id: 12, owner_id: '3', title: 'Habitación para estudiante en Argüelles', address: 'Calle de la Princesa, 60', city: 'Madrid', locality: 'Argüelles', postalCode: '28008', propertyType: PropertyType.ROOM, imageUrls: ['https://images.unsplash.com/photo-1560185893-a553def08e95?q=80&w=800&auto=format&fit=crop'], price: 480, visibility: 'Pública', views: 3200, compatibleCandidates: 55, conditions: 'Solo estudiantes. Ambiente tranquilo.', features: { wifi: true, heating: true, furnished: true, kitchen: true }, availableFrom: '2024-09-01', lat: 40.428, lng: -3.714, status: 'approved', bathrooms: 1 },
    { id: 13, owner_id: '3', title: 'Habitación con balcón en Poblenou', address: 'Rambla del Poblenou, 75', city: 'Barcelona', locality: 'Poblenou', postalCode: '08005', propertyType: PropertyType.ROOM, imageUrls: ['https://images.unsplash.com/photo-1594498654812-9b2f3a6152a4?q=80&w=800&auto=format&fit=crop'], price: 620, visibility: 'Pública', views: 4100, compatibleCandidates: 40, conditions: 'Se busca persona trabajadora y ordenada.', features: { wifi: true, airConditioning: true, balcony: true, elevator: true, washingMachine: true }, availableFrom: '2024-08-10', lat: 41.401, lng: 2.202, status: 'approved', bathrooms: 1 },
    { id: 14, owner_id: '3', title: 'Habitación exterior en Triana', address: 'Calle Betis, 50', city: 'Sevilla', locality: 'Triana', postalCode: '41010', propertyType: PropertyType.ROOM, imageUrls: ['https://images.unsplash.com/photo-1567016432779-1fee74902353?q=80&w=800&auto=format&fit=crop'], price: 400, visibility: 'Pública', views: 2800, compatibleCandidates: 65, conditions: 'Piso compartido con 2 personas más.', features: { airConditioning: true, kitchen: true, furnished: true, wifi: true }, availableFrom: '2024-09-01', lat: 37.384, lng: -6.002, status: 'approved', bathrooms: 1 }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 1, userId: '1', type: NotificationType.NEW_MATCH, message: '¡Tienes un nuevo match con Javier! Compatibilidad del 85%.', timestamp: '2024-07-25T10:30:00Z', read: false, relatedEntityId: 2 },
    { id: 2, userId: '3', type: NotificationType.PROPERTY_INQUIRY, message: 'Elena está interesada en tu "Habitación luminosa en Gràcia".', timestamp: '2024-07-25T09:00:00Z', read: true, relatedEntityId: 1 },
];

export const MOCK_SAVED_SEARCHES: SavedSearch[] = [
    { id: 1, userId: '1', name: 'Pisos en Malasaña', filters: { city: 'Madrid', locality: 'Malasaña', maxPrice: 600 } }
];

export const MOCK_BLOG_POSTS: BlogPost[] = [
    { id: 1, slug: '5-consejos-para-una-convivencia-exitosa', title: '5 Consejos para una Convivencia Exitosa', excerpt: 'Descubre las claves para mantener la armonía en tu piso compartido. Desde la comunicación hasta la limpieza, te lo contamos todo.', imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop', content: '<h2>1. Comunicación Abierta y Honesta</h2><p>La base de cualquier buena relación, incluida la de compañeros de piso, es la comunicación...</p>', author: 'Laura Sánchez', authorImageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=100&h=100&fit=crop', publish_date: '2024-07-15T12:00:00Z' },
];

export const MOCK_MATCHES: {[key: string]: string[]} = {
    '1': ['2'],
    '2': ['1']
};