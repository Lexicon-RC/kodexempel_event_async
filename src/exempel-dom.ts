// =====================================================================
//  KAFÉ KARDEMUMMA – EVENTLYSSNARE OCH FORMULÄR
//
//  UPPLÄGG: varje moment har två delar.
//    A = VARIANTER   Vilka finns det? Vad skiljer dem åt? (korta exempel)
//    B = EXEMPEL     Vi använder det i kaféet (samma sida hela dagen)
//
//
//  Varje del ligger i { } så att samma namn kan återanvändas.
//  Det som behövs i senare steg ligger utanför { } (markerat NÄSTA STEG BEHÖVER DENNA).
//
//  EVENTLYSSNARE:  1 click   2 Eventobjektet, mus och tangent   3 Delegering   4 preventDefault
//  FORMULÄR:       5 Läsa värden   6 submit och FormData   7 Validering
//
//  OBS 6C och 7B: 7B ERSÄTTER 6C. Kommentera tillbaka 6C innan du aktiverar 7B.
// =====================================================================

// #####################################################################
//  FÖRBEREDELSE – låt den här delen vara aktiv hela dagen
//  (sådant ni gjorde i modul 5 dag 3 och 4: array, objekt, createElement)
// #####################################################################

function hamta<T extends Element>(selektor: string): T {
    // liten hjälpfunktion: hittar ett element eller ger ett tydligt fel
    const el = document.querySelector<T>(selektor) // querySelector kan ge null...
    if (el === null) {
        throw new Error(`Hittar inget element: ${selektor}`) // ...då stoppar vi direkt och säger vilket
    }
    return el // här vet TypeScript att el finns
}

type Ratt = { id: number; namn: string; pris: number } // så ser en rätt ut

const RATTER: Ratt[] = [
    // kaféets meny
    { id: 1, namn: 'Kaffe', pris: 35 },
    { id: 2, namn: 'Latte', pris: 42 },
    { id: 3, namn: 'Kardemummabulle', pris: 32 },
    { id: 4, namn: 'Veganwrap', pris: 75 },
    { id: 5, namn: 'Te', pris: 30 }
]

// Elementen vi använder i stegen
const knapp = hamta<HTMLButtonElement>('#knapp')
const logg = hamta<HTMLParagraphElement>('#logg')
const ruta = hamta<HTMLDivElement>('#ruta')
const sok = hamta<HTMLInputElement>('#sok')
const menylista = hamta<HTMLUListElement>('#menylista')
const valt = hamta<HTMLParagraphElement>('#valt')
const lank = hamta<HTMLAnchorElement>('#lank')
const form = hamta<HTMLFormElement>('#bestallning')
const namn = hamta<HTMLInputElement>('#namn')
const rattSelect = hamta<HTMLSelectElement>('#ratt')
const antal = hamta<HTMLInputElement>('#antal')
const havre = hamta<HTMLInputElement>('#havre')
const kommentar = hamta<HTMLTextAreaElement>('#kommentar')
const raknare = hamta<HTMLDivElement>('#raknare')
const prisLive = hamta<HTMLSpanElement>('#pris-live')
const meddelande = hamta<HTMLDivElement>('#meddelande')
const bestallningarLista = hamta<HTMLUListElement>('#bestallningar')
const summa = hamta<HTMLParagraphElement>('#summa')

function radPris(ratt: Ratt, medHavre: boolean, antalSt: number): number {
    // pris för en orderrad
    return (ratt.pris + (medHavre ? 5 : 0)) * antalSt // havremjölk kostar 5 kr extra per styck
}

for (const ratt of RATTER) {
    // bygg menylistan och rullistan från arrayen
    const li = document.createElement('li') // en rad i listan
    li.className =
        'list-group-item list-group-item-action d-flex justify-content-between'
    li.dataset.id = String(ratt.id) // data-id="1" på raden (alltid text)
    const rattNamn = document.createElement('span')
    rattNamn.textContent = ratt.namn
    const rattPris = document.createElement('span')
    rattPris.className = 'badge text-bg-secondary'
    rattPris.textContent = `${ratt.pris} kr`
    li.append(rattNamn, rattPris) // barnen in i raden
    menylista.append(li) // raden in i listan

    const option = document.createElement('option') // samma rätt som alternativ i rullistan
    option.value = String(ratt.id)
    option.textContent = `${ratt.namn} (${ratt.pris} kr)`
    rattSelect.append(option)
}

// #####################################################################
//  DEL 1 – EVENTLYSSNARE
// #####################################################################

// =====================================================================
//  STEG 1A – addEventListener: VARIANTER

// =====================================================================
/*
{
  // --- Variant 1: anonym funktion (pilfunktion) direkt i anropet ---
  knapp.addEventListener("click", () => {                 // "click" = vilken händelse. () => {...} = vad som ska hända
    console.log("Klick! (anonym funktion)");              // körs varje gång någon klickar på knappen
  });

  // --- Variant 2: namngiven funktion ---
  function nuKlickade(): void {                           // en vanlig funktion med eget namn
    console.log("Klick! (namngiven funktion)");
  }
  knapp.addEventListener("click", nuKlickade);            // OBS: INGA parenteser. Vi skickar funktionen, vi kör den inte
  // knapp.addEventListener("click", nuKlickade());       // GISSA: ta bort // → rött + körs vid sidladdning, inte vid klick

  // --- Variant 3: flera lyssnare på samma element ---
  // Knappen har nu redan TVÅ lyssnare. Klicka och se: båda körs, i den ordning de lades till

  // --- Variant 4: { once: true } ---
  knapp.addEventListener("click", () => console.log("Bara första klicket"), { once: true });   // tas bort automatiskt efter första gången

  // --- Variant 5: ta bort en lyssnare ---
  knapp.addEventListener("dblclick", () => {              // dblclick = dubbelklick
    knapp.removeEventListener("click", nuKlickade);       // tar bort variant 2. Funkar BARA med namngiven funktion (samma funktion som lades till)
    console.log("nuKlickade är borttagen");
  });

  // Några vanliga händelser: click, dblclick, mouseenter, mouseleave, keydown, keyup,
  //                          input, change, focus, blur, submit
}
*/

// =====================================================================
//  STEG 1B – EXEMPEL: LÄGG TILL KAFFE (klicka och räkna)
//
// =====================================================================
/*
{
  let antalKaffe: number = 0;                             // let, för värdet ändras. Börjar på 0

  knapp.addEventListener("click", () => {                 // varje klick på knappen...
    antalKaffe++;                                         // ...ökar räknaren med 1
    logg.textContent = `Kaffe i varukorgen: ${antalKaffe}`;   // ...och skriver in det i texten på sidan
  });
}
*/

// =====================================================================
//  STEG 2A – EVENTOBJEKTET (e): VARIANTER
//
// =====================================================================
/*
{
  // --- Mushändelse: e är en MouseEvent ---
  ruta.addEventListener("click", (e) => {                 // e = eventobjektet. TypeScript vet att det är en MouseEvent
    console.log(e.type);                                  // "click" = vilken händelse det var
    console.log(e.clientX, e.clientY);                    // var på skärmen man klickade (pixlar)
    console.log(e.target);                                // elementet man klickade på
  });

  // --- Tangentbordshändelse: e är en KeyboardEvent ---
  sok.addEventListener("keydown", (e) => {                // keydown = en tangent trycks ned
    console.log(e.key);                                   // tecknet: "a", "Enter", "Escape", "ArrowDown"
    console.log(e.shiftKey);                              // true om Shift hölls nere
  });

  // --- Med en namngiven funktion måste du typa e själv ---
  function nuTangent(e: KeyboardEvent): void {            // KeyboardEvent = typen. Annars vet inte TypeScript vad e är
    console.log("Tangent:", e.key);
  }
  sok.addEventListener("keydown", nuTangent);             // skickas utan parenteser, som förut

  // --- input mot change på ett textfält ---
  sok.addEventListener("input", () => console.log("input:", sok.value));    // input = vid VARJE tecken
  sok.addEventListener("change", () => console.log("change:", sok.value));  // change = först när du lämnar fältet
}
*/

// =====================================================================
//  STEG 2B – EXEMPEL: HOVRA OCH SÖKA
//
// =====================================================================
/*
{
  ruta.addEventListener("mouseenter", () => {             // mouseenter = musen kommer in över rutan
    ruta.classList.add("bg-warning");                     // Bootstrap-klass: gul bakgrund
    ruta.textContent = "Välkommen in!";
  });
  ruta.addEventListener("mouseleave", () => {             // mouseleave = musen lämnar rutan
    ruta.classList.remove("bg-warning");                  // ta bort den gula
    ruta.textContent = "Håll musen här";
  });

  function filtrera(): void {                             // gömmer rader som inte matchar sökordet
    const text = sok.value.toLowerCase();                 // det man skrivit, med små bokstäver
    for (const li of menylista.children) {                // gå igenom alla rader i listan
      const matchar = (li.textContent ?? "").toLowerCase().includes(text);   // innehåller raden sökordet?
      li.classList.toggle("d-none", !matchar);            // toggle(klass, true) lägger till, false tar bort. d-none = göm
    }
  }
  sok.addEventListener("input", filtrera);                // filtrera vid varje tecken

  sok.addEventListener("keydown", (e) => {                // tangenter i sökrutan
    if (e.key === "Escape") {                             // Escape = rensa
      sok.value = "";                                     // tömmer fältet (det triggar INTE input-händelsen)
      filtrera();                                         // så vi kör filtreringen själva
    }
    if (e.key === "Enter") {                              // Enter = "skicka"
      console.log(`Söker efter: ${sok.value}`);
    }
  });
}
*/

// =====================================================================
//  STEG 3A – BUBBLING OCH DELEGERING: VARIANTER
//
// =====================================================================
/*
{
  // --- Problem: en lyssnare per rad ---
  // for (const li of menylista.children) { li.addEventListener("click", ...); }
  // Det funkar, men: 100 rätter = 100 lyssnare, och rader som skapas senare får ingen.

  // --- Bubbling: target mot currentTarget ---
  menylista.addEventListener("click", (e) => {            // lyssnaren sitter på listan (ul)
    console.log("target:", e.target);                     // det du faktiskt klickade på (kan vara texten eller märket)
    console.log("currentTarget:", e.currentTarget);       // där lyssnaren sitter (alltid listan)
  });

  // --- Delegering: hitta raden från det man klickade på ---
  menylista.addEventListener("click", (e) => {
    if (!(e.target instanceof HTMLElement)) {             // 1. target kan vara vad som helst. Kolla att det är ett HTML-element
      return;
    }
    const li = e.target.closest("li");                    // 2. closest = gå uppåt tills du hittar en li (även om du klickade på märket)
    if (li === null) {                                    // 3. klickade man utanför en rad blir det null
      return;
    }
    console.log(li.dataset.id);                           // 4. data-id från raden. Alltid text: "2"
  });
}
*/

// =====================================================================
//  STEG 3B – EXEMPEL: VÄLJ EN RÄTT I MENYN
//
// =====================================================================
/*
{
  menylista.addEventListener("click", (e) => {            // EN lyssnare för alla rader
    if (!(e.target instanceof HTMLElement)) {
      return;
    }
    const li = e.target.closest("li");                    // vilken rad klickade man på?
    if (li === null) {
      return;
    }
    const ratt = RATTER.find((r) => r.id === Number(li.dataset.id));   // data-id är text, Number() gör om till siffra
    if (ratt === undefined) {                             // find kan ge undefined
      return;
    }
    menylista.querySelector(".active")?.classList.remove("active");    // ta bort markeringen från förra raden (om det fanns en)
    li.classList.add("active");                           // markera den nya (Bootstrap)
    valt.textContent = `Du valde: ${ratt.namn} (${ratt.pris} kr)`;     // visa vad man valde
  });
}
*/

// =====================================================================
//  STEG 4A – preventDefault: STOPPA STANDARDBETEENDET
//
// =====================================================================
/*
{
  lank.addEventListener("click", (e) => {                 // klick på länken
    e.preventDefault();                                   // stoppar att webbläsaren följer länken
    console.log("Länken följdes inte");
    lank.textContent = "Du klickade, men ingen navigering skedde";   // vi gör något eget i stället
  });
  // GISSA: kommentera bort e.preventDefault() och klicka. Vad händer då?
}
*/

// #####################################################################
//  DEL 2 – FORMULÄR
// #####################################################################

// =====================================================================
//  STEG 5A – LÄSA VÄRDEN: VARIANTER PER FÄLTTYP
//
// =====================================================================
/*
{
  // --- Textfält: value ---
  namn.addEventListener("input", () => console.log("input:", namn.value));       // input = vid varje tecken
  namn.addEventListener("change", () => console.log("change:", namn.value));     // change = när du lämnar fältet

  // --- Sifferfält: value är text, valueAsNumber är siffra ---
  antal.addEventListener("input", () => {
    console.log(typeof antal.value, antal.value);                // "string" "3"  (text!)
    console.log(typeof antal.valueAsNumber, antal.valueAsNumber);// "number" 3    (siffra)
  });

  // --- Rullista (select) ---
  rattSelect.addEventListener("change", () => {                  // change = när man väljer något annat
    console.log(rattSelect.value);                               // value på valt alternativ, som text: "2"
    console.log(rattSelect.selectedIndex);                       // plats i listan: 0 = "Välj rätt...", 1 = Kaffe
    console.log(rattSelect.selectedOptions[0]?.text);            // texten användaren ser: "Latte (42 kr)"
  });

  // --- Kryssruta: checked, inte value ---
  havre.addEventListener("change", () => {
    console.log(havre.checked);                                  // true eller false. Det är checked man vill ha
    console.log(havre.value);                                    // alltid "ja", oavsett om den är ikryssad eller inte
  });

  // --- Radioknappar: hitta den som är vald ---
  form.addEventListener("change", () => {                        // change bubblar upp från fälten till formuläret
    const valdLeverans = form.querySelector<HTMLInputElement>('input[name="leverans"]:checked');   // :checked = den som är vald
    console.log(valdLeverans?.value);                            // "plats" eller "ta-med"
  });

  // --- Textarea: precis som textfält ---
  kommentar.addEventListener("input", () => console.log(kommentar.value.length));   // antal tecken hittills
}
*/

// =====================================================================
//  STEG 5B – EXEMPEL: LIVE-PRIS OCH TECKENRÄKNARE
//
// =====================================================================
/*
function uppdateraPris(): void {                          // NÄSTA STEG BEHÖVER DENNA
  const ratt = RATTER.find((r) => r.id === Number(rattSelect.value));   // vilken rätt är vald? ("" ger 0 = ingen)
  const antalSt = antal.valueAsNumber;                    // antalet som siffra. Tomt fält ger NaN
  if (ratt === undefined || Number.isNaN(antalSt)) {      // ingen rätt eller inget antal
    prisLive.textContent = "0 kr";
    return;
  }
  prisLive.textContent = `${radPris(ratt, havre.checked, antalSt)} kr`;   // räkna och visa
}

{
  rattSelect.addEventListener("change", uppdateraPris);   // ny rätt → nytt pris
  antal.addEventListener("input", uppdateraPris);         // nytt antal → nytt pris
  havre.addEventListener("change", uppdateraPris);        // havremjölk på/av → nytt pris

  kommentar.addEventListener("input", () => {             // vid varje tecken i kommentaren
    raknare.textContent = `${kommentar.value.length} / ${kommentar.maxLength} tecken`;   // maxLength kommer från HTML-attributet
  });

  form.addEventListener("reset", () => {                  // reset = någon trycker på Rensa (eller form.reset() anropas)
    prisLive.textContent = "0 kr";                        // fälten töms, så texterna ska nollas
    raknare.textContent = `0 / ${kommentar.maxLength} tecken`;
  });
}
*/

// =====================================================================
//  STEG 6A – submit OCH FormData: VARIANTER
//
// =====================================================================
/*
{
  form.addEventListener("submit", (e) => {                // submit = någon trycker Beställ (eller Enter i ett fält)
    e.preventDefault();                                   // utan denna laddas sidan om. GISSA: ta bort den och skicka. Titta i adressfältet

    // --- Variant 1: läs varje fält för sig ---
    console.log("V1", namn.value, rattSelect.value, antal.valueAsNumber, havre.checked);   // fungerar, men mycket att skriva

    // --- Variant 2: FormData läser alla fält som har name="..." i HTML ---
    const data = new FormData(form);                      // samla hela formuläret
    console.log("V2", data.get("namn"));                  // hämta ett fält via name. Typen är text, fil eller null
    console.log("V2", data.get("leverans"));              // radioknappen som är vald, utan :checked-trick

    // --- Variant 3: FormData som vanligt objekt ---
    const objekt = Object.fromEntries(data);              // gör om till { namn: "Anna", ratt: "2", ... }
    console.log("V3", objekt);                            // OBS: allt är text, och ej ikryssade kryssrutor finns inte med
  });
}
*/

// =====================================================================
//  STEG 6B – EXEMPEL: GÖR EN BESTÄLLNING (funktionen)
//
// =====================================================================
/*
type Bestallning = {                                      // NÄSTA STEG BEHÖVER DENNA. Så ser en beställning ut
  namn: string;
  ratt: Ratt;
  antal: number;
  leverans: string;
  havre: boolean;
  kommentar: string;
};

const bestallningar: Bestallning[] = [];                  // NÄSTA STEG BEHÖVER DENNA. Alla beställningar hittills

function visaBestallningar(): void {                      // NÄSTA STEG BEHÖVER DENNA. Bygger om listan på sidan
  bestallningarLista.replaceChildren();                   // töm först, annars blir det dubbletter
  let total = 0;                                          // let, summan växer
  for (const b of bestallningar) {                        // en rad per beställning
    const pris = radPris(b.ratt, b.havre, b.antal);
    total += pris;
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = `${b.namn}: ${b.antal} × ${b.ratt.namn}${b.havre ? " med havremjölk" : ""} (${b.leverans === "ta-med" ? "ta med" : "äta här"}) = ${pris} kr`;   // textContent: säkert även om någon skriver HTML
    bestallningarLista.append(li);
  }
  summa.textContent = `Totalt: ${total} kr`;
}

function laggTillBestallning(formular: HTMLFormElement): void {   // NÄSTA STEG BEHÖVER DENNA
  const data = new FormData(formular);                    // läs hela formuläret
  const ratt = RATTER.find((r) => r.id === Number(data.get("ratt")));   // data.get ger text, Number() gör siffra
  if (ratt === undefined) {                               // ingen rätt vald
    console.log("Ingen rätt vald");
    return;
  }
  bestallningar.push({                                    // bygg objektet och lägg i listan
    namn: String(data.get("namn")),
    ratt: ratt,
    antal: Number(data.get("antal")),
    leverans: String(data.get("leverans")),
    havre: data.has("havre"),                             // has: finns fältet med? (kryssrutor skickas bara när de är ikryssade)
    kommentar: String(data.get("kommentar")),
  });
  visaBestallningar();                                    // uppdatera sidan
}
*/

// =====================================================================
//  STEG 6C – EXEMPEL: KOPPLA FUNKTIONEN TILL FORMULÄRET
//  Kräver 6B.
//  OBS: kommentera tillbaka denna del innan du aktiverar 7B.
// =====================================================================
/*
{
  form.addEventListener("submit", (e) => {
    e.preventDefault();                                   // ingen omladdning
    laggTillBestallning(form);                            // läs, bygg objekt, visa
    form.reset();                                         // töm formuläret (det sätter tillbaka fälten och triggar reset-händelsen)
  });
  // GISSA: skicka med tomt namn. Vad händer? (Ingen kontroll än. Det löser vi i 7.)
}
*/

// =====================================================================
//  STEG 7A – VALIDERING: VARIANTER
//
// =====================================================================
/*
{
  // --- Variant 1: HTML-attribut (ligger redan i index.html) ---
  // required (måste fyllas i), minlength="2", min="1" max="10", type="number", pattern="..."
  // Tips: ta bort novalidate på <form> i index.html → webbläsaren visar egna bubblor.
  //       Vi har novalidate så att VI styr hur felen visas.

  // --- Variant 2: webbläsarens validity-objekt ---
  namn.addEventListener("input", () => {
    console.log(namn.validity.valid);                     // true om fältet är OK
    console.log(namn.validity.valueMissing);              // true om required men tomt
    console.log(namn.validity.tooShort);                  // true om kortare än minlength (efter att man skrivit själv)
    console.log(namn.validationMessage);                  // webbläsarens eget felmeddelande
  });
  antal.addEventListener("input", () => {
    console.log(antal.validity.rangeUnderflow);           // true om under min
    console.log(antal.validity.rangeOverflow);            // true om över max
  });
  console.log(form.checkValidity());                      // hela formuläret på en gång: true/false

  // --- Variant 3: egen kontroll i JavaScript ---
  namn.addEventListener("blur", () => {                   // blur = man lämnar fältet
    if (namn.value.trim().length < 2) {                   // trim() tar bort mellanslag i början och slutet
      namn.classList.remove("is-valid");
      namn.classList.add("is-invalid");                   // Bootstrap: röd ram + visar invalid-feedback
    } else {
      namn.classList.remove("is-invalid");
      namn.classList.add("is-valid");                     // Bootstrap: grön ram
    }
  });
}
*/

// =====================================================================
//  STEG 7B – EXEMPEL: BESTÄLL MED VALIDERING
//  Kräver 6B. ERSÄTTER 6C (kommentera tillbaka 6C först).
//
// =====================================================================
/*
{
  namn.addEventListener("input", () => {
    namn.setCustomValidity("");                           // nollställ vårt eget fel när användaren skriver igen
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();                                   // ingen omladdning

    namn.setCustomValidity(namn.value.trim().length < 2 ? "Skriv minst 2 tecken" : "");   // egen regel: bara mellanslag räknas inte. "" = inget fel
    if (!form.checkValidity()) {                          // finns det något ogiltigt fält?
      form.classList.add("was-validated");                // Bootstrap visar nu rött och grönt på alla fält
      meddelande.replaceChildren();                       // ta bort ett gammalt tack-meddelande
      return;                                             // avbryt, ingen beställning
    }

    const kundNamn = namn.value.trim();                   // spara namnet innan formuläret töms
    laggTillBestallning(form);                            // allt är OK: lägg beställningen
    form.reset();                                         // töm formuläret
    form.classList.remove("was-validated");               // ta bort färgerna igen

    const tack = document.createElement("div");           // tack-meddelande
    tack.className = "alert alert-success";
    tack.textContent = `Tack ${kundNamn}! Din beställning är mottagen.`;   // textContent: säkert
    meddelande.replaceChildren(tack);                     // ersätt eventuellt gammalt meddelande
  });
}
*/
