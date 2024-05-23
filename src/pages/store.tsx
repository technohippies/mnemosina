import { Component, createSignal, onMount, createEffect, onCleanup } from 'solid-js';
import ScrollableWrapper from '../components/ScrollableWrapper';
import ProductGrid from '../components/ProductGrid';
import PurchaseList from '../components/PurchaseList'; // Updated import
import CoinGecko from 'coingecko-api-client';
import i18n from '../i18n';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  buyUrl: string;
}

interface Domain {
  label: string;
  url: string;
  iconType: string; 
  price: number; 
  icon: string; 
  currency: string;
  svgIcon?: string; 
}

const Store: Component = () => {
  const [products, setProducts] = createSignal<Product[]>([]);
  const [streak, setStreak] = createSignal(0);
  const [polygonPrice, setPolygonPrice] = createSignal(null);
  const [loadingPrice, setLoadingPrice] = createSignal(true);
  const [translations, setTranslations] = createSignal({
    pokemonCards: i18n.t('pokemonCards'),
    buyCardInfo: i18n.t('buyCardInfo'),
    learnMore: i18n.t('learnMore'),
    web3Domains: i18n.t('web3Domains'),
    ownYourName: i18n.t('ownYourName'),
    seeExample: i18n.t('seeExample')
  });
  const client = new CoinGecko();

  const fetchPolygonPrice = async () => {
    setLoadingPrice(true);
    const price = await client.getPriceById({
      ids: ['matic-network'], 
      vs_currencies: ['cny']
    });
    setPolygonPrice(price['matic-network'].cny);
    setLoadingPrice(false);
  };

  const [domains, setDomains] = createSignal<Domain[]>([
    { label: "vip.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/7750854729847552694350870351633387160717627073545077143428868782352268941454", iconType: "link", price: 99, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "donna.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/37831819366850868095681010774269643398429324533389727298811125435175273216032", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "noah.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/68335316435511623445453880967575635400126048537215290378140261424959476993424", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "ana.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/37831819366850868095681010774269643398429324533389727298811125435175273216032", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "victoria.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/43419968225534315562456511197172462789637074877199895378436646352759199076824", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "jacob.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/66619123859664389469430759664342257168209678122679029214767577083664265767382", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "mia.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/84002809474150329183010435237202083718726256635922706864212639633527200168415", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "lucy.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/57189678558668935339590581037432334540819689326577359300032447000938204753522", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "mark.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/29760775159070244660020311958577488799444613221458050662766013398174396541869", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "raya.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/58357718027891704227631748556053254980400905677012255672033098329813221195119", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "aaron.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/63582063138624166141233866218195658086589753977307733393472376183325212914397", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "hilda.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/109635942362427440635302313341170366302086031116054566287787762624355860921720", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "fran.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/75133277863492389964658624634768024993031824453662027457455936203026708133812", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "cole.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/39484684023010680224453312490791214979777705698322896795705534374478917385890", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "andrew.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/99730253085318994974451371524053627609265745519333152102370625830506442253538", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "gaby.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/48839071898539257886633801663552372210024843575275352960559464915518084033726", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "peter.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/82098081235709639565978553485586171725611880675035191006215056332231057960447", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "ruby.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/34434939394946787178036909863272432949887769292652068151817923374712924867943", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "alex.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/40623705658953882072081523889128433849965460411267418399680991715306767379295", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "emily.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/22408848772214806641118527406663618372403347515349711987787592083375603165748", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "ryan.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/19676311107311490421583701515557369632921162128559934066650775595572619995883", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "sophia.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/114858068532588234543547157143784939960072367944056771758506267019553564649437", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "david.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/52223970723503911625761394367714182399560711748266111547318263024271555252130", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "grace.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/3066563560198809859572616742942752897251693079209335535252695081214202425635", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "john.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/76524033918108002596578933155055759460150667254243888269507679214504691463086", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "alita.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/107757423500707281610560775656535195122314496289701737059960663329548626795220", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "adam.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/108438398311180354237229187029499705783504394406477595818607718709677837284756", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "evey.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/77860740161290807990283695897841629830439147515387419539600972802142728557514", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "angel.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/10774463033841178288003545076684908610382022469878755265634077004743805676410", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "king.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/105082898141092231329179774862517388371556401608886663173838882271010811905036", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },
    { label: "queen.vstudent.x", url: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f/52080114565114188720022992544566528065334225968559172019652668833493518505046", iconType: "link", price: 69, icon: "/icons/matic.svg", currency: "$MATIC", svgIcon: "/icons/ud.svg" },

    
  ]);

  const fetchProducts = async () => {
    setProducts([
      { id: 1, name: "2020 Chinese Legendary Clash Mimikyu (Gem Mint 10)", price: 88, imageUrl: "https://ipfs.filebase.io/ipfs/QmUZwpFmTHMejxm4TEkNDXAEdTeKcWjNb9AQeS8S4PB949/QmWeMR9vqk9ncdWhxi5QrNf3PTr7vLSjLKjseDVDSc8Few", buyUrl: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0x251be3a17af4892035c37ebf5890f4a4d889dcad/80657563442237750164557131786380940550089022508858929740683370787302401243602", icon: "/icons/matic.svg" },
      { id: 2, name: "2023 Chinese Scarlet & Violet Mewtwo (Pristine 10)", price: 88, imageUrl: "https://ipfs.filebase.io/ipfs/QmUKYwTrmZrbfntxmiAAesfxUBY4dznfcurqK9LhmHp1ZM/QmPf3pehYVMwq3i3vRdWZ2cFgNcK62nvHkpgBFFs1nqB64", buyUrl: "https://www.okx.com/web3/marketplace/nft/asset/polygon/0x251be3a17af4892035c37ebf5890f4a4d889dcad/12585758016789234291384287310442877126651678413418428067700268618775613935948", icon: "/icons/matic.svg" }
    ]);
  };

  createEffect(() => {
    const updateTranslations = () => {
      setTranslations({
        pokemonCards: i18n.t('pokemonCards'),
        buyCardInfo: i18n.t('buyCardInfo'),
        learnMore: i18n.t('learnMore'),
        web3Domains: i18n.t('web3Domains'),
        ownYourName: i18n.t('ownYourName'),
        seeExample: i18n.t('seeExample')
      });
    };

    i18n.on('languageChanged', updateTranslations);
    onCleanup(() => i18n.off('languageChanged', updateTranslations));
  });

  onMount(() => {
    fetchProducts();
    fetchPolygonPrice().then(() => {
      console.log(polygonPrice());
    });
  });

  return (
    <ScrollableWrapper streak={streak()} showSaveIcon={true}>
      <div class="mt-8 px-4 pb-36">
        <h1 class="text-xl text-center font-bold flex items-center justify-center bg-gray-800 rounded-lg py-6 mb-8">
          1 RMB = {loadingPrice() ? <div class="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-4"></div> : `${polygonPrice()} Polygon $MATIC`}
          <img src="/icons/matic.svg" class="inline-block w-6 h-6 align-middle ml-2"></img>
        </h1>
        
        <div class="text-xl mb-2 font-bold">{translations().pokemonCards}</div>
        <p class="text-lg mb-6">{translations().buyCardInfo} <a href="https://courtyard.io/" target="_blank" class="font-bold blue-500 underline">{translations().learnMore}</a></p>
        <ProductGrid products={products()} />
        <div class="text-xl mb-2 font-bold mt-8">{translations().web3Domains}</div>
        <p class="text-lg mb-6">{translations().ownYourName} <a href="https://ud.me/vstudent.x" target="_blank" class="font-bold blue-500 underline">{translations().seeExample}</a></p>
        <PurchaseList items={domains()} />
      </div>
    </ScrollableWrapper>
  );
};

export default Store;