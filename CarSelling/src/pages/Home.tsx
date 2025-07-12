import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonPage,
    IonTitle,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    IonButton,
    IonCard,
    IonCardContent,
    IonLabel,
    IonButtons,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonCheckbox,
    IonRadio,
    IonSpinner,
    IonAccordion,
    IonBackButton,
    IonSelect,
    IonToggle,
    IonTabBar,
    IonTabButton, IonRouterOutlet,
    IonTabs, IonFooter,
    IonItem,
    IonText, IonCardHeader, IonCardTitle, IonSelectOption
} from '@ionic/react';
import {carSportOutline, cashOutline, homeOutline, personOutline, sparklesOutline} from 'ionicons/icons';
import './Home.css';
import axios from 'axios';
import {Redirect, Route, useHistory, useLocation} from "react-router-dom";



const HomePage: React.FC = () => {
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [yearMin, setYearMin] = useState<number | undefined>();
    const [hpMin, setHpMin] = useState<number | undefined>();
    const [engineSizeMin, setEngineSizeMin] = useState<number | undefined>();
    const [priceMax, setPriceMax] = useState<number | undefined>();
    const [mileageMax, setMileageMax] = useState<number | undefined>();
    const [fuel, setFuel] = useState('');
    const [bodyType, setBodyType] = useState('');
    const [past, setPast] = useState(false);
    const [yearMax, setYearMax] = useState<number | undefined>();
    const [hpMax, setHpMax] = useState<number | undefined>();
    const [engineSizeMax, setEngineSizeMax] = useState<number | undefined>();
    const [priceMin, setPriceMin] = useState<number | undefined>();
    const [mileageMin, setMileageMin] = useState<number | undefined>();

    const [brands, setBrands] = useState<string[]>([]);
    const [models, setModels] = useState<string[]>([]);

    const [cars, setCars] = useState<AuctionPreview[]>([]);
    const [loading, setLoading] = useState(true);

    const userId = parseInt(localStorage.getItem("userId") || "0");

    const history = useHistory();

    function useIsMobile(breakpoint = 550) {
        const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

        useEffect(() => {
            const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, [breakpoint]);

        return isMobile;
    }

    const isMobile = useIsMobile();

    const location = useLocation();

    interface AuctionPreview {
        id: number;
        title: string;
        make: string;
        model: string;
        year: number;
        mileage: number;
        imageUrl: string;
    }


    useEffect(() => {
        const fetchCars = async () => {
            try {
                const res = await axios.get<AuctionPreview[]>(`http://localhost:5000/Recommendation/${userId}`);
                setCars(res.data.slice(0, 6)); // afișăm doar primele 6 recomandări
            } catch (err) {
                console.error("Error loading home recommendations:", err);
            } finally {
                setLoading(false);
            }
        };
        if (userId > 0) fetchCars();
    }, [userId]);


    interface AuctionFilter {
        make?: string;
        model?: string;
        yearMin?: number;
        yearMax?: number;
        hpMin?: number;
        hpMax?: number;
        engineSizeMin?: number;
        engineSizeMax?: number;
        priceMin?: number;
        priceMax?: number;
        mileageMin?: number;
        mileageMax?: number;
        fuel?: string;
        bodyType?: string;
        status?: 'active' | 'inactive';
        page?: number;
        cursor?: number;
        pageSize?: number;
    }

    const handleSearch = async () => {
        const filters: AuctionFilter = {
            make,
            model,
            yearMin,
            hpMin,
            engineSizeMin,
            priceMax,
            mileageMax,
            fuel,
            bodyType,
            yearMax,
            hpMax,
            engineSizeMax,
            priceMin,
            mileageMin,
            status: past ? 'inactive' : 'active',
            page: 1,
            pageSize: 10,
        };

        history.push({
            pathname: "/car-search",
            state: filters
        });
    };

    const handleReset = () => {
        setMake('');
        setModel('');
        setYearMin(undefined);
        setYearMax(undefined);
        setHpMin(undefined);
        setHpMax(undefined);
        setEngineSizeMin(undefined);
        setEngineSizeMax(undefined);
        setPriceMin(undefined);
        setPriceMax(undefined);
        setMileageMin(undefined);
        setMileageMax(undefined);
        setFuel('');
        setBodyType('');
        setPast(false);
    };


    // Fetch all brands on mount
    useEffect(() => {
        axios.get("http://localhost:5000/api/car/getAllBrands")
            .then(res => setBrands(res.data))
            .catch(err => {
                console.error("Failed to fetch brands:", err);
            });
    }, []);

    // Fetch models for selected brand
    useEffect(() => {
        if (make) {
            axios.get(`http://localhost:5000/api/car/getAllModels/${make}`)
                .then(res => setModels(res.data))
                .catch(err => {
                    console.error("Failed to fetch models:", err);
                    setModels([]);
                });
        } else {
            setModels([]);
        }
    }, [make]);

    const [maxWidth, setMaxWidth] = useState("1400px");

    const [isDarkMode, setIsDarkMode] = useState(window.matchMedia("(prefers-color-scheme: dark)").matches);

    useEffect(() => {
        // Listen for dark mode changes dynamically
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (event: MediaQueryListEvent) => setIsDarkMode(event.matches);

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    const updateMaxWidth = () => {
        if (window.innerWidth > 1800) {
            setMaxWidth("1600px");
        } else if (window.innerWidth > 1400) {
            setMaxWidth("1400px");
        } else if (window.innerWidth > 1200) {
            setMaxWidth("1200px");
        } else {
            setMaxWidth("100%");
        }
    };

    useEffect(() => {
        updateMaxWidth();
        window.addEventListener("resize", updateMaxWidth);
        return () => window.removeEventListener("resize", updateMaxWidth);
    }, []);


    return (
        <IonPage>
            {!isMobile && (
            <IonHeader style={{ paddingTop : "1.5px" }}>
                <IonToolbar style={{ maxWidth, margin: "0 auto", "--background": isDarkMode ? "#121212" : "#fff" }}>
                    <IonButtons slot="start">
                        <IonButton routerLink="/" fill="clear" style={{"--color-hover": "#4ad493"}}>
                            {/*<IonTitle>LOGO</IonTitle>*/}
                            <img src="/logo-placeholder.png" alt="Logo" style={{ height: "40px" }} />
                        </IonButton>
                    </IonButtons>
                    <IonButtons slot="primary" style={{ display: "flex", gap: "15px" }}>
                        <IonButton routerLink="/car-favorites" style={{"--color-hover": "#4ad493"}}>
                            Parked
                        </IonButton>
                        <IonButton routerLink="/car-recommendations" style={{"--color-hover": "#4ad493"}}>
                            Recommendations
                        </IonButton>
                        <IonButton routerLink="/sell-car" style={{"--color-hover": "#4ad493"}}>
                            Sell a Car
                        </IonButton>
                        <IonButton routerLink="/auth" style={{ backgroundColor: "#4ad493", color: "#121212", borderRadius: "50px"}}>
                            <IonIcon slot="icon-only" icon={personOutline}></IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            )}

            <IonContent fullscreen>
                <div style={{ maxWidth, margin: "0 auto", padding: "10px" }}>
                    <h2 style={{ marginBottom: '10px' }}>Search Filters</h2>
                    <IonCard>
                        <IonCardContent>
                            <IonGrid>
                                <IonRow>
                                    {/* Make and Model */}
                                    <IonCol size="12" sizeMd="6">
                                        <IonItem>
                                            <IonSelect
                                                label="Brand"
                                                labelPlacement="floating"
                                                value={make}
                                                onIonChange={(e) => {
                                                    setMake(e.detail.value);  // ✅ corect
                                                    setModel("");
                                                }}
                                                style={{ "--highlight-color-focused": "#4ad493" }}
                                            >
                                                {brands.map((brand, index) => (
                                                    <IonSelectOption key={index} value={brand}>
                                                        {brand}
                                                    </IonSelectOption>
                                                ))}
                                            </IonSelect>

                                        </IonItem>
                                    </IonCol>
                                    <IonCol size="12" sizeMd="6">
                                        <IonItem>
                                            <IonSelect
                                                value={model}
                                                label="Model"
                                                labelPlacement="floating"
                                                placeholder="Select Model"
                                                onIonChange={(e) => setModel(e.detail.value)}
                                            >
                                                {models.map((m, index) => (
                                                    <IonSelectOption key={index} value={m}>
                                                        {m}
                                                    </IonSelectOption>
                                                ))}
                                            </IonSelect>
                                        </IonItem>
                                    </IonCol>


                                    <IonCol size="6" sizeMd="3">
                                        <IonItem>
                                            <IonSelect
                                                label="Year Min"
                                                labelPlacement="floating"
                                                interface="popover"
                                                value={yearMin}
                                                onIonChange={(e) => setYearMin(parseInt(e.detail.value, 10))}
                                            >
                                                {Array.from({ length: 2025 - 1969 + 1 }, (_, i) => 2025 - i).map((year) => (
                                                    <IonSelectOption key={year} value={year}>
                                                        {year}
                                                    </IonSelectOption>
                                                ))}
                                            </IonSelect>
                                        </IonItem>
                                    </IonCol>

                                    <IonCol size="6" sizeMd="3">
                                        <IonItem>
                                            <IonSelect
                                                label="Year Max"
                                                labelPlacement="floating"
                                                interface="popover"
                                                value={yearMax}
                                                onIonChange={(e) => setYearMax(parseInt(e.detail.value, 10))}
                                            >
                                                {Array.from({ length: 2025 - 1969 + 1 }, (_, i) => 2025 - i).map((year) => (
                                                    <IonSelectOption key={year} value={year}>
                                                        {year}
                                                    </IonSelectOption>
                                                ))}
                                            </IonSelect>
                                        </IonItem>
                                    </IonCol>


                                    {/* HP */}
                                    <IonCol size="6" sizeMd="3">
                                        <IonItem>
                                            <IonInput
                                                label="HP Min"
                                                labelPlacement="floating"
                                                type="number"
                                                value={hpMin ?? ""}
                                                onIonChange={e => setHpMin(parseInt(e.detail.value!, 10))}
                                                style={{ "--highlight-color-focused": "#4ad493" }}
                                            />
                                        </IonItem>
                                    </IonCol>
                                    <IonCol size="6" sizeMd="3">
                                        <IonItem>
                                            <IonInput
                                                label="HP Max"
                                                labelPlacement="floating"
                                                type="number"
                                                value={hpMax ?? ""}
                                                onIonChange={e => setHpMax(parseInt(e.detail.value!, 10))}
                                                style={{ "--highlight-color-focused": "#4ad493" }}
                                            />
                                        </IonItem>
                                    </IonCol>

                                    {/* Engine Size */}
                                    <IonCol size="6" sizeMd="3">
                                        <IonItem>
                                            <IonInput
                                                label="Engine Size Min"
                                                labelPlacement="floating"
                                                type="number"
                                                value={engineSizeMin ?? ""}
                                                onIonChange={e => setEngineSizeMin(parseFloat(e.detail.value!))}
                                                style={{ "--highlight-color-focused": "#4ad493" }}
                                            />
                                        </IonItem>
                                    </IonCol>
                                    <IonCol size="6" sizeMd="3">
                                        <IonItem>
                                            <IonInput
                                                label="Engine Size Max"
                                                labelPlacement="floating"
                                                type="number"
                                                value={engineSizeMax ?? ""}
                                                onIonChange={e => setEngineSizeMax(parseFloat(e.detail.value!))}
                                                style={{ "--highlight-color-focused": "#4ad493" }}
                                            />
                                        </IonItem>
                                    </IonCol>

                                    {/* Price */}
                                    <IonCol size="6" sizeMd="3">
                                        <IonItem>
                                            <IonInput
                                                label="Price Min (€)"
                                                labelPlacement="floating"
                                                type="number"
                                                value={priceMin ?? ""}
                                                onIonChange={e => setPriceMin(parseInt(e.detail.value!, 10))}
                                                style={{ "--highlight-color-focused": "#4ad493" }}
                                            />
                                        </IonItem>
                                    </IonCol>
                                    <IonCol size="6" sizeMd="3">
                                        <IonItem>
                                            <IonInput
                                                label="Price Max (€)"
                                                labelPlacement="floating"
                                                type="number"
                                                value={priceMax ?? ""}
                                                onIonChange={e => setPriceMax(parseInt(e.detail.value!, 10))}
                                                style={{ "--highlight-color-focused": "#4ad493" }}
                                            />
                                        </IonItem>
                                    </IonCol>

                                    {/* Mileage */}
                                    <IonCol size="6" sizeMd="3">
                                        <IonItem>
                                            <IonInput
                                                label="Mileage Min (km)"
                                                labelPlacement="floating"
                                                type="number"
                                                value={mileageMin ?? ""}
                                                onIonChange={e => setMileageMin(parseInt(e.detail.value!, 10))}
                                                style={{ "--highlight-color-focused": "#4ad493" }}
                                            />
                                        </IonItem>
                                    </IonCol>
                                    <IonCol size="6" sizeMd="3">
                                        <IonItem>
                                            <IonInput
                                                label="Mileage Max (km)"
                                                labelPlacement="floating"
                                                type="number"
                                                value={mileageMax ?? ""}
                                                onIonChange={e => setMileageMax(parseInt(e.detail.value!, 10))}
                                                style={{ "--highlight-color-focused": "#4ad493" }}
                                            />
                                        </IonItem>
                                    </IonCol>

                                    {/* Fuel and Body Type */}
                                    <IonCol size="6" sizeMd="3">
                                        <IonItem>
                                            <IonSelect
                                                label="Fuel Type"
                                                labelPlacement="floating"
                                                value={fuel}
                                                onIonChange={e => setFuel(e.detail.value!)}
                                                style={{ "--highlight-color-focused": "#4ad493" }}
                                            >
                                                <IonSelectOption value="Petrol">Petrol</IonSelectOption>
                                                <IonSelectOption value="Diesel">Diesel</IonSelectOption>
                                                <IonSelectOption value="Other">Other</IonSelectOption>
                                            </IonSelect>
                                        </IonItem>
                                    </IonCol>
                                    <IonCol size="6" sizeMd="3">
                                        <IonItem>
                                            <IonSelect
                                                label="Body Type"
                                                labelPlacement="floating"
                                                value={bodyType}
                                                onIonChange={e => setBodyType(e.detail.value!)}
                                                style={{ "--highlight-color-focused": "#4ad493" }}
                                            >
                                                <IonSelectOption value="Sedan">Sedan</IonSelectOption>
                                                <IonSelectOption value="SUV">SUV</IonSelectOption>
                                                <IonSelectOption value="Coupe">Coupe</IonSelectOption>
                                                <IonSelectOption value="Convertible">Convertible</IonSelectOption>
                                                <IonSelectOption value="Hatchback">Hatchback</IonSelectOption>
                                                <IonSelectOption value="Wagon">Wagon</IonSelectOption>
                                            </IonSelect>
                                        </IonItem>
                                    </IonCol>

                                    {/* Toggle */}
                                    <IonCol size="12">
                                        <IonItem lines="none">
                                            <IonLabel>Get Past Auctions</IonLabel>
                                            <IonToggle
                                                checked={past}
                                                onIonChange={e => setPast(e.detail.checked)}
                                            />
                                            <IonButton
                                                slot="end"
                                                fill="clear"
                                                size="default"
                                                onClick={handleReset}
                                                style={{ marginLeft: "auto", "--color": "#4ad493" }}
                                            >
                                                Reset
                                            </IonButton>
                                        </IonItem>
                                    </IonCol>

                                    <IonCol size="12">
                                        <IonButton
                                            expand="block"
                                            size="default"
                                            onClick={handleSearch}
                                            style={{
                                                "--background": "#4ad493",
                                                padding: "16px 0",
                                                fontSize: "18px"
                                            }}
                                        >
                                            Search
                                        </IonButton>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonCardContent>
                    </IonCard>

                    <h2 style={{ marginTop: '30px' }}>Recommended Cars</h2>

                    {userId === 0 ? (
                        <div style={{ textAlign: "center", paddingTop: "12px" }}>
                            <IonText color="medium">
                                <p><strong>Log in</strong> to see personalized car recommendations.</p>
                            </IonText>
                            <IonButton
                                routerLink="/auth"
                                style={{
                                    marginTop: "10px",
                                    "--background": "#4ad493",
                                    "--color": "#121212",
                                    borderRadius: "20px",
                                    paddingInline: "24px"
                                }}
                            >
                                Log in
                            </IonButton>
                        </div>
                    ) : loading ? (
                        <div style={{ textAlign: "center", paddingTop: "8px" }}>
                            <IonSpinner name="crescent" />
                        </div>
                    ) : cars.length === 0 ? (
                        <IonText color="medium">
                            <p style={{ paddingLeft: "12px" }}>
                                No recommendations found at the moment.
                            </p>
                        </IonText>
                    ) : (
                        <IonRow>
                            {cars.map((car, index) => (
                                <IonCol key={index} size="12" size-sm="6" size-md="4">
                                    <IonCard
                                        className="hover-expand-home"
                                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                                        routerLink={`/car-detail/${car.id}`}
                                    >
                                        <img
                                            src={`http://localhost:5000${car.imageUrl}`}
                                            alt={car.title}
                                            style={{
                                                width: "100%",
                                                height: "150px",
                                                objectFit: "cover",
                                                borderRadius: "8px"
                                            }}
                                        />
                                        <IonCardContent>
                                            <IonLabel>
                                                <h2>{car.make} {car.model}</h2>
                                                <p>{car.year} • {car.mileage} km</p>
                                            </IonLabel>
                                        </IonCardContent>
                                    </IonCard>
                                </IonCol>
                            ))}
                        </IonRow>
                    )}
                </div>
            </IonContent>

            {isMobile && (
                <IonFooter className="ion-hide-md-up">
                    <IonToolbar
                        style={{
                            '--background': 'var(--ion-background-color)',
                            paddingBottom: 'env(safe-area-inset-bottom)',
                        }}
                    >
                        <IonButtons
                            slot="start"
                            style={{
                                width: '100%',
                                justifyContent: 'space-around',
                            }}
                        >
                            {[
                                { href: '/home', icon: homeOutline, label: 'Home' },
                                { href: '/car-favorites', icon: carSportOutline, label: 'Parked' },
                                { href: '/car-recommendations', icon: sparklesOutline, label: 'AI' },
                                { href: '/sell-car', icon: cashOutline, label: 'Sell' },
                                { href: '/auth', icon: personOutline, label: 'Account' },
                            ].map(({ href, icon, label }) => {
                                const isActive = location.pathname === href;
                                return (
                                    <IonButton
                                        key={href}
                                        fill="clear"
                                        routerLink={href}
                                        style={{
                                            minWidth: '50px',
                                            color: isActive ? '#4ad493' : 'var(--ion-color-medium)',
                                    }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <IonIcon icon={icon} />
                                            <span
                                                style={{
                                                    fontSize: '0.7rem',
                                                    marginTop: '2px',
                                                    lineHeight: 1,
                                                    color: 'inherit',
                                                }}
                                            >
                                            {label}
                                            </span>
                                        </div>
                                    </IonButton>
                                );
                            })}
                        </IonButtons>
                    </IonToolbar>
                </IonFooter>
            )}
        </IonPage>
    );
};

export default HomePage;
