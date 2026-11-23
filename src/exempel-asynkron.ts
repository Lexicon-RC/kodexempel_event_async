// =====================================================================
//  KAFÉ KARDEMUMMA – ASYNKRON KOD
//
//  UPPLÄGG: varje moment har två delar.
//    A = VARIANTER   Vilka finns det? Vad skiljer dem åt? (korta exempel)
//    B = EXEMPEL     Vi använder det i kaféet (samma sida hela dagen)
//
//  Varje del ligger i { } så att samma namn kan återanvändas.
//  Det som behövs i senare steg ligger utanför { } (markerat NÄSTA STEG BEHÖVER DENNA).
//
//  1 Timers   2 Callbacks   3 Promise   4 async/await   5 Felhantering
//  6 fetch    7 Flera saker samtidigt   8 Ordningen (bonus)
//
//  BEROENDEN: 4B och 5B kräver 3B. 7B kräver 6B. Allt annat går att aktivera för sig.
//  Rätt tankesätt hela dagen: asynkront = "starta nu, få svaret senare".
// =====================================================================

// #####################################################################
//  FÖRBEREDELSE – låt den här delen vara aktiv hela dagen
// #####################################################################

function hamta<T extends Element>(selektor: string): T {
    // hittar ett element eller ger ett tydligt fel
    const el = document.querySelector<T>(selektor) // querySelector kan ge null...
    if (el === null) {
        throw new Error(`Hittar inget element: ${selektor}`) // ...då stoppar vi direkt och säger vilket
    }
    return el // här vet TypeScript att el finns
}

type Ratt = { id: number; namn: string; pris: number } // så ser en rätt ut (samma som i meny.json)

const TID: number = 800 // millisekunder per steg i demot, så att det går lagom fort

function vanta(ms: number): Promise<void> {
    // "vänta ms millisekunder" som ett löfte. Hur den funkar: steg 3
    return new Promise((resolve) => setTimeout(resolve, ms))
}

// Elementen vi använder i stegen
const bryggKnapp = hamta<HTMLButtonElement>('#brygg-knapp')
const bryggStatus = hamta<HTMLParagraphElement>('#brygg-status')
const bonorSlut = hamta<HTMLInputElement>('#bonor-slut')
const knappCallback = hamta<HTMLButtonElement>('#knapp-callback')
const statusCallback = hamta<HTMLSpanElement>('#status-callback')
const knappPromise = hamta<HTMLButtonElement>('#knapp-promise')
const statusPromise = hamta<HTMLSpanElement>('#status-promise')
const knappAwait = hamta<HTMLButtonElement>('#knapp-await')
const statusAwait = hamta<HTMLSpanElement>('#status-await')
const knappTrycatch = hamta<HTMLButtonElement>('#knapp-trycatch')
const statusTrycatch = hamta<HTMLSpanElement>('#status-trycatch')
const knappLaddaMeny = hamta<HTMLButtonElement>('#ladda-meny')
const knappLaddaFel = hamta<HTMLButtonElement>('#ladda-fel')
const knappAllt = hamta<HTMLButtonElement>('#ladda-allt')
const knappEfter = hamta<HTMLButtonElement>('#ladda-efter')
const menyStatus = hamta<HTMLParagraphElement>('#meny-status')
const menyContainer = hamta<HTMLDivElement>('#meny-container')
const specialRuta = hamta<HTMLDivElement>('#special-ruta')
const alltStatus = hamta<HTMLParagraphElement>('#allt-status')

// #####################################################################
//  STEG 1 – TIMERS
// #####################################################################

// =====================================================================
//  STEG 1A – setTimeout OCH setInterval: VARIANTER
//
// =====================================================================
/*
{
  // --- Ordningen: koden väntar INTE ---
  console.log("1. Först");
  setTimeout(() => console.log("3. Efter 1 sekund"), 1000);   // setTimeout(vad, efter hur många ms): körs EN gång, senare
  console.log("2. Sen (väntade inte på raden ovanför)");      // GISSA: i vilken ordning skrivs det ut?

  // --- 0 millisekunder är ändå "senare" ---
  setTimeout(() => console.log("Sist, trots 0 ms"), 0);       // hamnar efter all vanlig kod
  console.log("Den här kommer före, fast den står efter");

  // --- setInterval: upprepas ---
  let nedrakning: number = 3;                                  // let, värdet ändras
  const id = setInterval(() => {                               // setInterval(vad, ms): körs om och om igen
    console.log(nedrakning);
    nedrakning--;                                              // 3, 2, 1
    if (nedrakning === 0) {
      clearInterval(id);                                       // stoppa intervallet. Annars fortsätter det för alltid
      console.log("Klart!");
    }
  }, 1000);                                                    // varje sekund

  // --- Avbryta en timeout innan den hunnit ---
  const timeout = setTimeout(() => console.log("Den här syns aldrig"), 5000);
  clearTimeout(timeout);                                       // avbruten. Varje timer har ett id att avbryta med
}
*/

// =====================================================================
//  STEG 1B – EXEMPEL: BRYGG KAFFE MED NEDRÄKNING
//
// =====================================================================
/*
{
  bryggKnapp.addEventListener("click", () => {                 // vid klick
    bryggKnapp.disabled = true;                                // lås knappen så ingen brygger dubbelt
    let sekunder: number = 3;                                  // let, värdet ändras
    bryggStatus.textContent = `Brygger... ${sekunder}`;        // visa 3 direkt

    const id = setInterval(() => {                             // varje sekund...
      sekunder--;                                              // ...räkna ner
      if (sekunder > 0) {
        bryggStatus.textContent = `Brygger... ${sekunder}`;    // 2, sen 1
      } else {
        clearInterval(id);                                     // stoppa timern
        bryggStatus.textContent = "Kaffet är klart!";
        bryggKnapp.disabled = false;                           // lås upp knappen
      }
    }, 1000);
  });
}
*/

// #####################################################################
//  STEG 2 – CALLBACKS
// #####################################################################

// =====================================================================
//  STEG 2A – CALLBACKS: VARIANTER OCH PROBLEMET
//
// =====================================================================
/*
{
  // --- Variant 1: callbacken är redan något ni gjort ---
  setTimeout(() => console.log("Klart efter 1 sekund"), 1000);   // pilfunktionen är callbacken

  // --- Variant 2: en egen funktion som tar en callback ---
  function mala(gram: number, klart: (resultat: string) => void): void {   // klart = funktionen vi ska anropa när vi är färdiga
    setTimeout(() => klart(`${gram} g malda bönor`), 500);                 // efter en halv sekund: anropa klart med resultatet
  }
  mala(18, (resultat) => console.log(resultat));                           // vi lämnar över vad som ska hända sen

  // --- Problemet: flera steg efter varandra ---
  mala(18, (a) => {                                            // steg 1...
    console.log(a);
    mala(20, (b) => {                                          // ...då steg 2...
      console.log(b);
      mala(22, (c) => {                                        // ...då steg 3
        console.log(c);                                        // koden växer åt höger: "callback hell" eller "pyramid of doom"
      });
    });
  });
  // Och om steg 2 går fel? Varje nivå måste ha en egen felhantering. Det blir snabbt oläsligt.
}
*/

// =====================================================================
//  STEG 2B – EXEMPEL: BESTÄLL KAFFE MED CALLBACKS
//
// =====================================================================
/*
{
  function jobba(ms: number, klart: () => void): void {        // ett steg som tar ms millisekunder
    setTimeout(klart, ms);                                     // när tiden gått: anropa klart
  }

  knappCallback.addEventListener("click", () => {
    knappCallback.disabled = true;
    statusCallback.textContent = "Maler bönor...";
    jobba(TID, () => {                                         // 1. klart med malningen...
      statusCallback.textContent = "Brygger...";
      jobba(TID, () => {                                       // 2. ...klart med bryggningen...
        statusCallback.textContent = "Serverar...";
        jobba(TID, () => {                                     // 3. ...klart med serveringen
          statusCallback.textContent = "Kaffet är klart!";
          knappCallback.disabled = false;
        });
      });
    });
  });
  // GISSA: kryssa i "Bönorna är slut" och beställ. Vad händer? (Inget. Koden vet inte om felet.)
}
*/

// #####################################################################
//  STEG 3 – PROMISE
// #####################################################################

// =====================================================================
//  STEG 3A – PROMISE: VARIANTER
//
// =====================================================================
/*
{
  // --- Skapa ett löfte ---
  const lofte = new Promise<string>((resolve, reject) => {     // Promise<string> = löftet ger text när det lyckas
    setTimeout(() => resolve("Kaffe!"), 1000);                 // resolve(värde) = löftet infrias, med det här värdet
    // reject(new Error("Slut på bönor"));                     // reject(fel) = löftet bryts. GISSA: byt rad och se
  });
  console.log(lofte);                                          // Promise { <pending> }: inte klart ännu

  // --- Ta emot svaret: then, catch, finally ---
  lofte
    .then((svar) => console.log("Fick:", svar))                // then: körs när löftet infrias
    .catch((fel) => console.log("Fel:", fel))                  // catch: körs om löftet bryts
    .finally(() => console.log("Klart, oavsett"));             // finally: körs alltid

  // --- Kedja: varje then ger ett nytt löfte ---
  Promise.resolve(2)                                           // ett löfte som redan är infriat med värdet 2
    .then((n) => n * 10)                                       // returnerar ett nytt värde...
    .then((n) => console.log(n));                              // ...som nästa then får: 20

  // --- Två färdiga genvägar ---
  Promise.resolve("direkt").then(console.log);                 // ett löfte som alltid är infriat
  Promise.reject(new Error("direkt fel")).catch((fel) => console.log(fel.message));   // ett som alltid är brutet
}
*/

// =====================================================================
//  STEG 3B – EXEMPEL: BESTÄLL KAFFE MED PROMISE
//
// =====================================================================
/*
function gorSteg(namn: string): Promise<string> {              // NÄSTA STEG BEHÖVER DENNA. Ett steg som ger ett löfte
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (namn === "Brygger" && bonorSlut.checked) {           // kryssrutan provocerar fram ett fel i bryggsteget
        reject(new Error("Bönorna är slut"));                  // löftet bryts
      } else {
        resolve(`${namn} klart`);                              // löftet infrias
      }
    }, TID);
  });
}

{
  knappPromise.addEventListener("click", () => {
    knappPromise.disabled = true;
    statusPromise.textContent = "Maler bönor...";
    gorSteg("Maler")
      .then(() => {
        statusPromise.textContent = "Brygger...";
        return gorSteg("Brygger");                             // returnera nästa löfte: kedjan väntar på det
      })
      .then(() => {
        statusPromise.textContent = "Serverar...";
        return gorSteg("Serverar");
      })
      .then(() => {
        statusPromise.textContent = "Kaffet är klart!";
      })
      .catch((fel: unknown) => {                               // EN catch för hela kedjan
        statusPromise.textContent = fel instanceof Error ? `Fel: ${fel.message}` : "Något gick fel";
      })
      .finally(() => {
        knappPromise.disabled = false;                         // körs alltid, så knappen fastnar aldrig
      });
  });
  // JÄMFÖR med 2B: kedjan är platt, och felhanteringen är ett enda ställe.
}
*/

// #####################################################################
//  STEG 4 – ASYNC / AWAIT
// #####################################################################

// =====================================================================
//  STEG 4A – async OCH await: VARIANTER
//
// =====================================================================
/*
{
  // --- async gör att en funktion ALLTID returnerar ett Promise ---
  async function hej(): Promise<string> {                      // async framför function
    return "Hej";                                              // vi returnerar text, men får ut Promise<string>
  }
  console.log(hej());                                          // Promise { "Hej" }, inte bara "Hej"

  // --- await plockar ut värdet, men bara inne i en async-funktion ---
  async function testa(): Promise<void> {
    const text = await hej();                                  // väntar tills löftet är klart och ger själva texten
    console.log(text);                                         // "Hej"
    // const fel = hej(); console.log(fel.length);             // GISSA: ta bort // → rött. Utan await är det ett Promise, inte text
  }
  testa();

  // --- Koden under en await väntar, men resten av sidan gör det inte ---
  async function ordning(): Promise<void> {
    console.log("A");
    await vanta(500);                                          // pausar bara DEN HÄR funktionen
    console.log("C");
  }
  ordning();
  console.log("B");                                            // GISSA: A, B, C. Sidan fortsätter medan ordning() väntar

  // --- async pilfunktion, till exempel som eventlyssnare ---
  bryggKnapp.addEventListener("click", async () => {           // async före parentesen
    await vanta(500);
    console.log("500 ms efter klicket");
  });
}
*/

// =====================================================================
//  STEG 4B – EXEMPEL: BESTÄLL KAFFE MED async/await
//  Kräver 3B.
//
// =====================================================================
/*
{
  knappAwait.addEventListener("click", async () => {
    knappAwait.disabled = true;
    statusAwait.textContent = "Maler bönor...";
    await gorSteg("Maler");                                    // vänta på steget, sen vidare
    statusAwait.textContent = "Brygger...";
    await gorSteg("Brygger");
    statusAwait.textContent = "Serverar...";
    await gorSteg("Serverar");
    statusAwait.textContent = "Kaffet är klart!";
    knappAwait.disabled = false;
  });
  // JÄMFÖR med 2B och 3B: läses som vanlig kod, rad för rad.
  // GISSA: kryssa i "Bönorna är slut" och beställ. Vad händer med knappen? (Den fastnar. Felhantering saknas, se 5.)
}
*/

// #####################################################################
//  STEG 5 – FELHANTERING
// #####################################################################

// =====================================================================
//  STEG 5A – try / catch / finally MED await: VARIANTER
//
// =====================================================================
/*
{
  // --- try / catch med await ---
  async function testa(): Promise<void> {
    try {
      await Promise.reject(new Error("Slut på bönor"));        // ett brutet löfte
      console.log("Hit kommer vi aldrig");                     // koden efter felet hoppas över
    } catch (fel) {                                            // hamnar här i stället
      console.log("Fångade:", fel);
      if (fel instanceof Error) {                              // fel har typen unknown, så kolla typen först
        console.log(fel.message);                              // nu får vi använda .message
      }
    } finally {
      console.log("Körs alltid, med eller utan fel");
    }
  }
  testa();

  // --- Egna fel med throw ---
  async function kontrolleraAlder(alder: number): Promise<string> {
    if (alder < 18) {
      throw new Error("För ung");                              // throw i en async-funktion = brutet löfte
    }
    return "Välkommen";
  }
  kontrolleraAlder(15).catch((fel) => console.log(fel.message));   // catch fungerar också med async-funktioner

  // --- Utan catch syns felet bara som rött i konsolen ---
  // Promise.reject(new Error("Ingen fångade mig"));           // GISSA: ta bort // → "Uncaught (in promise)" i konsolen
}
*/

// =====================================================================
//  STEG 5B – EXEMPEL: BESTÄLL KAFFE MED try / catch
//  Kräver 3B.
//
// =====================================================================
/*
{
  knappTrycatch.addEventListener("click", async () => {
    knappTrycatch.disabled = true;
    statusTrycatch.classList.remove("text-danger");            // ta bort rött från förra gången
    try {
      statusTrycatch.textContent = "Maler bönor...";
      await gorSteg("Maler");
      statusTrycatch.textContent = "Brygger...";
      await gorSteg("Brygger");                                // här kan det gå fel (bönor slut)
      statusTrycatch.textContent = "Serverar...";
      await gorSteg("Serverar");
      statusTrycatch.textContent = "Kaffet är klart!";
    } catch (fel) {
      statusTrycatch.classList.add("text-danger");             // Bootstrap: röd text
      statusTrycatch.textContent = fel instanceof Error ? `Fel: ${fel.message}` : "Något gick fel";
    } finally {
      knappTrycatch.disabled = false;                          // körs ALLTID, så knappen fastnar aldrig
    }
  });
  // GISSA: kryssa i "Bönorna är slut" och beställ. Jämför med 4B.
}
*/

// #####################################################################
//  STEG 6 – FETCH
// #####################################################################

// =====================================================================
//  STEG 6A – fetch: VARIANTER
//
// =====================================================================
/*
{
  // --- Variant 1: then ---
  fetch("/meny.json")                                          // ger ett Promise<Response>
    .then((svar) => svar.json())                               // json() läser innehållet. Det ger OCKSÅ ett Promise
    .then((data) => console.log(data))                         // nu har vi datan (typen är any)
    .catch((fel) => console.log("Nätverksfel:", fel));         // catch: bara om nätverket strular

  // --- Variant 2: await (läses uppifrån och ned) ---
  async function hamtaMeny(): Promise<void> {
    const svar = await fetch("/meny.json");                    // 1. vänta på svaret
    console.log(svar.ok, svar.status);                         // true 200
    const ratter: Ratt[] = await svar.json();                  // 2. vänta på innehållet. Vi talar om för TypeScript vad det är
    console.log(ratter.length, ratter[0]?.namn);               // 5 "Kaffe"
  }
  hamtaMeny();

  // --- VIKTIGT: fetch bryts INTE av 404 eller 500 (/api/saknas ger 404, /api/fel ger 500, se vite.config.ts) ---
  async function hamtaFel(): Promise<void> {
    const svar = await fetch("/api/saknas");              // sidan finns inte
    console.log(svar.ok, svar.status);                         // false 404, men inget fel kastades
    if (!svar.ok) {
      throw new Error(`Servern svarade ${svar.status}`);       // vi måste själva kolla ok och kasta felet
    }
  }
  hamtaFel().catch((fel) => console.log(fel.message));         // först nu kan catch fånga det
}
*/

// =====================================================================
//  STEG 6B – EXEMPEL: LADDA MENYN
//
// =====================================================================
/*
async function hamtaJson<T>(url: string, fordrojning: number = 0): Promise<T> {   // NÄSTA STEG BEHÖVER DENNA
  await vanta(fordrojning);                                    // bara för demot: gör att "Laddar" hinner synas
  const svar = await fetch(url);                               // hämta
  if (!svar.ok) {                                              // 404, 500 och så vidare
    throw new Error(`Servern svarade ${svar.status}`);         // gör om till ett riktigt fel
  }
  return await svar.json();                                    // innehållet. <T> = typen den som anropar säger att det är
}

async function laddaMeny(url: string): Promise<void> {         // ladda och visa menyn
  knappLaddaMeny.disabled = true;                              // lås knapparna medan vi laddar
  knappLaddaFel.disabled = true;
  menyContainer.replaceChildren();                             // töm gammal meny
  specialRuta.replaceChildren();
  alltStatus.textContent = "";
  menyStatus.textContent = "Laddar menyn...";                  // 1. LADDAR
  try {
    const ratter = await hamtaJson<Ratt[]>(url, TID);          // vänta på menyn. <Ratt[]> = vi förväntar oss en lista med rätter
    if (ratter.length === 0) {                                 // 2. TOMT
      menyStatus.textContent = "Inga rätter hittades.";
      return;
    }
    for (const ratt of ratter) {                               // 3. KLART: ett kort per rätt
      const kolumn = document.createElement("div");
      kolumn.className = "col-6";
      const kort = document.createElement("div");
      kort.className = "card card-body py-2";
      kort.textContent = `${ratt.namn}, ${ratt.pris} kr`;      // textContent: säkert även om datan skulle innehålla HTML
      kolumn.append(kort);
      menyContainer.append(kolumn);
    }
    menyStatus.textContent = `${ratter.length} rätter laddade`;
  } catch (fel) {                                              // 4. FEL
    menyStatus.textContent = fel instanceof Error ? `Kunde inte ladda menyn: ${fel.message}` : "Något gick fel";
  } finally {
    knappLaddaMeny.disabled = false;                           // lås upp, vad som än hände
    knappLaddaFel.disabled = false;
  }
}

{
  knappLaddaMeny.addEventListener("click", () => {
    void laddaMeny("/meny.json");                              // void = vi väntar inte på resultatet här, laddaMeny sköter allt själv
  });
  knappLaddaFel.addEventListener("click", () => {
    void laddaMeny("/api/saknas");                        // en adress som inte finns: visar felhanteringen
  });
}
*/

// #####################################################################
//  STEG 7 – FLERA SAKER SAMTIDIGT
// #####################################################################

// =====================================================================
//  STEG 7A – Promise.all, allSettled, race: VARIANTER
//
// =====================================================================
/*
{
  async function jobb(namn: string, ms: number): Promise<string> {   // ett jobb som tar ms millisekunder
    await vanta(ms);
    return `${namn} klart`;
  }

  async function kor(): Promise<void> {
    // --- Efter varandra: tiderna läggs ihop ---
    let start = performance.now();                             // klocka i millisekunder
    await jobb("A", 500);
    await jobb("B", 500);
    await jobb("C", 500);
    console.log("Efter varandra:", Math.round(performance.now() - start), "ms");   // ungefär 1500

    // --- Promise.all: alla startar samtidigt, tiden blir det långsammaste ---
    start = performance.now();
    const svar = await Promise.all([jobb("A", 500), jobb("B", 500), jobb("C", 500)]);   // en lista med löften in, en lista med svar ut
    console.log(svar);                                         // ["A klart", "B klart", "C klart"], i samma ordning som du skrev dem
    console.log("Samtidigt:", Math.round(performance.now() - start), "ms");           // ungefär 500

    // --- Promise.all ger upp så fort ETT jobb misslyckas ---
    try {
      await Promise.all([jobb("A", 100), Promise.reject(new Error("B föll"))]);
    } catch (fel) {
      console.log("all gav upp:", fel instanceof Error ? fel.message : fel);
    }

    // --- allSettled: väntar på ALLA och berättar hur det gick för var och en ---
    const resultat = await Promise.allSettled([jobb("A", 100), Promise.reject(new Error("B föll"))]);
    for (const r of resultat) {
      if (r.status === "fulfilled") {                          // infriat
        console.log("OK:", r.value);
      } else {                                                 // brutet
        console.log("Fel:", r.reason);
      }
    }

    // --- race: den snabbaste vinner ---
    const snabbast = await Promise.race([jobb("Långsam", 800), jobb("Snabb", 200)]);
    console.log(snabbast);                                     // "Snabb klart"
  }
  kor();
}
*/

// =====================================================================
//  STEG 7B – EXEMPEL: MENY OCH DAGENS SPECIAL
//  Kräver 6B.
//
// =====================================================================
/*
type Special = { id: number; text: string };                   // så ser specialen ut i special.json

function visaMenyOchSpecial(ratter: Ratt[], special: Special, ms: number, satt: string): void {   // NÄSTA STEG BEHÖVER DENNA
  menyContainer.replaceChildren();
  for (const ratt of ratter) {
    const kolumn = document.createElement("div");
    kolumn.className = "col-6";
    const kort = document.createElement("div");
    kort.className = "card card-body py-2";
    kort.textContent = `${ratt.namn}, ${ratt.pris} kr`;
    kolumn.append(kort);
    menyContainer.append(kolumn);
  }
  const ruta = document.createElement("div");
  ruta.className = "alert alert-warning";
  ruta.textContent = special.text;
  specialRuta.replaceChildren(ruta);
  menyStatus.textContent = `${ratter.length} rätter laddade`;
  alltStatus.textContent = `${satt}: ${ms} ms`;                // hur lång tid det tog
}

{
  knappAllt.addEventListener("click", async () => {
    menyStatus.textContent = "Laddar...";
    const start = performance.now();
    const [ratter, special] = await Promise.all([              // båda startar direkt. Vi plockar ut var sitt svar
      hamtaJson<Ratt[]>("/meny.json", TID),
      hamtaJson<Special>("/special.json", TID),
    ]);
    visaMenyOchSpecial(ratter, special, Math.round(performance.now() - start), "Samtidigt");   // tid: ungefär TID
  });

  knappEfter.addEventListener("click", async () => {
    menyStatus.textContent = "Laddar...";
    const start = performance.now();
    const ratter = await hamtaJson<Ratt[]>("/meny.json", TID);        // vänta klart...
    const special = await hamtaJson<Special>("/special.json", TID);   // ...och först sen den andra
    visaMenyOchSpecial(ratter, special, Math.round(performance.now() - start), "Efter varandra");   // tid: ungefär 2 × TID
  });
}
*/

// #####################################################################
//  STEG 8 – ORDNINGEN (BONUS, klassisk fråga på intervjuer)
// #####################################################################

// =====================================================================
//  STEG 8A – VAD KÖRS FÖRST?
//
// =====================================================================
/*
{
  console.log("1. vanlig kod");                                // körs direkt
  setTimeout(() => console.log("4. setTimeout med 0 ms"), 0);  // väntar tills ALL annan kod och alla löften är klara
  Promise.resolve().then(() => console.log("3. promise.then")); // löften går före timers
  console.log("2. vanlig kod igen");                           // vanlig kod fortsätter först
  // Ordning: 1, 2, 3, 4
}
*/
