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
    IonIcon, IonCheckbox, IonRadio, IonSpinner, IonAccordion, IonBackButton, IonSelect, IonToggle
} from '@ionic/react';
import { personOutline } from 'ionicons/icons';
import './Home.css';
import axios from 'axios';
import { useHistory } from "react-router-dom";


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

    const history = useHistory();

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
            status: past ? 'inactive' : 'active',
            page: 1,
            pageSize: 10,
        };

        history.push({
            pathname: "/car-search",
            state: filters
        });
    };

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


    const carImages = [
        { src: "/car1.jpg", name: "BMW 5" },
        { src: "/car2.jpg", name: "Audi A6" },
        { src: "/car3.jpg", name: "Mercedes C" },
        { src: "/car4.jpg", name: "Model S" },
        { src: "/car5.jpg", name: "Ford Mustang" },
        { src: "/car6.jpg", name: "Porsche 911" },
        { src: "/car7.jpg", name: "Ferrari 812" },
        { src: "/car8.jpg", name: "Audi R8" }
    ];

    return (
        <IonPage>
            <IonHeader style={{ paddingTop : "1.5px" }}>
                <IonToolbar style={{ maxWidth, margin: "0 auto", "--background": isDarkMode ? "#121212" : "#fff" }}>
                    <IonButtons slot="start">
                        <IonButton routerLink="/" fill="clear" style={{"--color-hover": "#4ad493"}}>
                            {/*<IonTitle>LOGO</IonTitle>*/}
                            <img src="/logo-placeholder.png" alt="Logo" style={{ height: "40px" }} />
                        </IonButton>
                    </IonButtons>
                    <IonButtons slot="primary" style={{ display: "flex", gap: "15px" }}>
                        <IonButton routerLink="/" style={{"--color-hover": "#4ad493"}}>
                            Parked
                        </IonButton>
                        <IonButton routerLink="/" style={{"--color-hover": "#4ad493"}}>
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

            <IonContent fullscreen>
                <div style={{ maxWidth, margin: "0 auto", padding: "10px" }}>
                    <IonGrid>
                        <IonRow>
                            <IonCol size="12" size-md="6">
                                <h2>Feature Cars</h2>
                                <IonRow>
                                    {carImages.map((car, index) => (
                                        <IonCol key={index} size="12" size-sm="6">
                                            <IonCard className="hover-expand-home" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <img
                                                    src={car.src}
                                                    alt={car.name}
                                                    style={{
                                                        width: "100%",
                                                        height: "150px",
                                                        objectFit: "cover",
                                                        borderRadius: "8px"
                                                    }}
                                                />
                                                <IonCardContent>
                                                    <IonLabel>{car.name}</IonLabel>
                                                </IonCardContent>
                                            </IonCard>
                                        </IonCol>
                                    ))}
                                </IonRow>
                            </IonCol>
                            <IonCol size="12" size-md="6">
                                <h2>Search</h2>
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <IonInput placeholder="Search by Brand" value={make} onIonChange={e => setMake(e.detail.value!)} />
                                    <IonInput placeholder="Search by Model" value={model} onIonChange={e => setModel(e.detail.value!)} />
                                    <IonInput placeholder="Search by Year" type="number" value={yearMin} onIonChange={e => setYearMin(parseInt(e.detail.value!, 10))} />
                                    <IonInput placeholder="Search by HP" type="number" value={hpMin} onIonChange={e => setHpMin(parseInt(e.detail.value!, 10))} />
                                    <IonInput placeholder="Search by Engine Size" type="number" value={engineSizeMin} onIonChange={e => setEngineSizeMin(parseFloat(e.detail.value!))} />
                                    <IonInput placeholder="Search by Price" type="number" value={priceMax} onIonChange={e => setPriceMax(parseInt(e.detail.value!, 10))} />
                                    <IonInput placeholder="Search by Mileage" type="number" value={mileageMax} onIonChange={e => setMileageMax(parseInt(e.detail.value!, 10))} />
                                    <IonInput placeholder="Search by Fuel" value={fuel} onIonChange={e => setFuel(e.detail.value!)} />
                                    <IonInput placeholder="Search by Body Type" value={bodyType} onIonChange={e => setBodyType(e.detail.value!)} />

                                    <IonToggle justify={"start"} checked={past} onIonChange={e => setPast(e.detail.checked)}>Get Past Auctions</IonToggle>

                                    <IonButton expand="full" onClick={handleSearch}>Search</IonButton>
                                </div>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default HomePage;
