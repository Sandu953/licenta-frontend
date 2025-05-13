import React, {useEffect, useRef, useState} from "react";
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    IonCard,
    IonCardContent,
    IonLabel, IonRouterLink, IonText,
    IonInfiniteScroll,
    IonInfiniteScrollContent
} from "@ionic/react";
import { personOutline } from "ionicons/icons";
import "./CarSearch.css";
import { useLocation } from "react-router-dom";
import axios from 'axios';

const CarSearch: React.FC = () => {
    const location = useLocation<{ filters: AuctionFilter }>();
    const filters = location.state as AuctionFilter;

    const [cars, setCars] = useState<AuctionPreview[]>([]);

    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const [maxWidth, setMaxWidth] = useState("1400px");

    const [isDarkMode, setIsDarkMode] = useState(window.matchMedia("(prefers-color-scheme: dark)").matches);

    const hasMountedRef = useRef(false);

    interface AuctionPreview {
        id : number;
        title: string;
        make: string;
        model: string;
        location: string;
        year: number;
        mileage: number;
        currentBid: number;
        startTime: string;
        imageUrl: string;
        isFavorite: boolean;
        ownerUserName : string;
        ownerPfp : string;
    }

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

    const loadMoreCars = async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        const lastCarId = cars.length > 0 ? cars[cars.length - 1].id : undefined;
        const response = await fetchAuctions({
            ...filters,
            cursor: lastCarId,
            pageSize: 10
        });

        setCars(prev => [...prev, ...response]);
        setHasMore(response.length === 10); // dacă mai sunt 10, înseamnă că s-ar putea să mai urmeze

        setLoading(false);
    };

    useEffect(() => {
        if (!hasMountedRef.current) {
            hasMountedRef.current = true;
            loadMoreCars();
        }
    }, []);

    const fetchAuctions = async (filters: AuctionFilter) => {
        const response = await axios.get<AuctionPreview[]>('http://localhost:5000/api/auctions/filter', {
            params: filters,
        });
        return response.data;
    };

    const CountdownTimer = ({ startTime }: { startTime: string }) => {
        const getEndTime = (startTime: string) => {
            const start = new Date(startTime);
            const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
            return end;
        };

        const calculateTimeLeft = () => {
            const difference = +getEndTime(startTime) - +new Date();
            return difference > 0 ? {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / (1000 * 60)) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            } : null;
        };

        const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

        useEffect(() => {
            const timer = setInterval(() => {
                setTimeLeft(calculateTimeLeft());
            }, 1000);
            return () => clearInterval(timer);
        }, [startTime]);

        if (!timeLeft) return <span className="text-red-600">Auction ended</span>;

        return (
            <span>
                {timeLeft.days}d {timeLeft.hours.toString().padStart(2, '0')}:
                {timeLeft.minutes.toString().padStart(2, '0')}:
                {timeLeft.seconds.toString().padStart(2, '0')}
            </span>
        );
    };


    // useEffect(() => {
    //     if (!filters) return;
    //
    //     const loadAuctions = async () => {
    //         const data = await fetchAuctions(filters);
    //         setCars(data);
    //     };
    //
    //     loadAuctions();
    // }, [filters]);


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




    const carListings = [
        { id: 1, brand: "BMW", model: "5 Series", price: "45,000", year: 2020, km: "123,456 KM", fuel: "Petrol", src: "/car1.jpg", parked: true },
        { id: 2, brand: "Audi", model: "A6", price: "42,000", year: 2019, km: "98,000 KM", fuel: "Diesel", src: "/car2.jpg", parked: false },
        { id: 3, brand: "Mercedes", model: "C-Class", price: "50,000", year: 2021, km: "75,000 KM", fuel: "Hybrid", src: "/car3.jpg", parked: false },
        { id: 4, brand: "Tesla", model: "Model 3", price: "20,000", year: 2021, km: "100,000 KM", fuel: "Electric", src: "/car4.jpg", parked: false },
        { id: 5, brand: "Ford", model: "Mustang", price: "60,000", year: 2020, km: "7,000 KM", fuel: "Petrol", src: "/car5.jpg", parked: false },
        { id: 6, brand: "Porsche", model: "911", price: "100,000", year: 2024, km: "5,000 KM", fuel: "Hybrid", src: "/car6.jpg", parked: false },
        { id: 7, brand: "Ferrari", model: "812", price: "500,000", year: 2023, km: "2,000 KM", fuel: "Petrol", src: "/car7.jpg", parked: false },
        { id: 8, brand: "Audi", model: "R8", price: "120,000", year: 2021, km: "7,000 KM", fuel: "Petrol", src: "/car8.jpg", parked: false },
    ];

    // State to track parked cars
    //const [cars, setCars] = useState(carListings);

    // Function to toggle parked state
    // const togglePark = (id: number) => {
    //     setCars((prevCars) =>
    //         prevCars.map((car) =>
    //             car.id === id ? { ...car, parked: !car.parked } : car
    //         )
    //     );
    // };

    return (
        <IonPage>
            {/* Navigation Bar */}
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
                        <IonButton routerLink="/" style={{"--color-hover": "#4ad493"}}>
                            Sell a Car
                        </IonButton>
                        <IonButton routerLink="/auth" style={{ backgroundColor: "#4ad493", color: "#121212", borderRadius: "50px"}}>
                            <IonIcon slot="icon-only" icon={personOutline}></IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            {/* Search Filters */}
            <IonContent fullscreen>
                <div style={{maxWidth, margin: "0 auto", padding: "16px" }}>
                    <IonGrid>
                        <IonRow>
                            <IonCol size="12" size-md="3">
                                <IonInput placeholder="Search by Model"  />
                            </IonCol>
                            <IonCol size="12" size-md="3">
                                <IonInput placeholder="Search by Brand"  />
                            </IonCol>
                            <IonCol size="12" size-md="3">
                                <IonInput placeholder="Search by Year" type="number"/>
                            </IonCol>
                            <IonCol size="12" size-md="3">
                                <IonButton expand="block">More Advanced Filters</IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    <IonGrid>
                        {/*{cars.map((car) => (*/}
                        {/*    <IonRouterLink routerLink="/car-detail">*/}
                        {/*        <IonCard className="hover-expand-search" key={car.id} style={{ display: "flex", "--flex-direction": "row" ,padding: "12px", minHeight: "200px" }}>*/}
                        {/*            /!* Wrap the Image and Title in a Link *!/*/}
                        {/*            <img*/}
                        {/*                src={car.src}*/}
                        {/*                alt={`${car.brand} ${car.model}`}*/}
                        {/*                style={{ width: "325px", height: "195px", objectFit: "cover"}}*/}
                        {/*            />*/}
                        {/*            <IonCardContent>*/}
                        {/*                <IonLabel style={{ flexGrow: 1 }}>*/}
                        {/*                    <h1>{car.brand}, {car.model}</h1>*/}
                        {/*                    <p>{car.km} | {car.fuel} | {car.year}</p>*/}
                        {/*                </IonLabel>*/}
                        {/*                <IonButton*/}
                        {/*                    fill="clear"*/}
                        {/*                    onClick={(e) => {*/}
                        {/*                        e.preventDefault();  // Prevents the default navigation behavior*/}
                        {/*                        e.stopPropagation(); // Prevent navigation*/}
                        {/*                        // Place your custom functionality here*/}
                        {/*                        console.log("Private Seller button clicked");*/}
                        {/*                    }}*/}
                        {/*                    style={{*/}
                        {/*                    position: "absolute",*/}
                        {/*                    bottom: "10px",*/}
                        {/*                    left: "10px"*/}
                        {/*                }}>*/}
                        {/*                    <IonIcon icon={personOutline} />*/}
                        {/*                    Private Seller*/}
                        {/*                </IonButton>*/}
                        {/*            </IonCardContent>*/}

                        {/*            <span style={{*/}
                        {/*                position: "absolute",*/}
                        {/*                top: "20px",*/}
                        {/*                right: "20px",*/}
                        {/*                fontSize: "1.32rem",*/}
                        {/*                fontWeight: "bold",*/}
                        {/*                backgroundColor: "#4ad493",*/}
                        {/*                color: "#121212",*/}
                        {/*                padding: "5px 10px",*/}
                        {/*                borderRadius: "8px"*/}
                        {/*            }}*/}
                        {/*            >*/}
                        {/*            {car.price} EUR*/}
                        {/*        </span>*/}

                        {/*            <IonButton*/}
                        {/*                fill="clear"*/}
                        {/*                onClick={(e) => {*/}
                        {/*                    e.preventDefault();  // Prevents the default navigation behavior*/}
                        {/*                    e.stopPropagation(); // Prevents click from navigating*/}
                        {/*                    togglePark(car.id);*/}
                        {/*                }}*/}
                        {/*                style={{*/}
                        {/*                    position: "absolute",*/}
                        {/*                    bottom: "10px",*/}
                        {/*                    right: "20px",*/}
                        {/*                    width: "60px",*/}
                        {/*                    height: "60px",*/}
                        {/*                    display: "flex",*/}
                        {/*                    justifyContent: "center",*/}
                        {/*                    alignItems: "center",*/}
                        {/*                    padding: "1px",*/}
                        {/*                    overflow: "hidden", // Prevents unwanted shifts*/}
                        {/*                    "--border-radius": "50%",*/}
                        {/*                    "--background": car.parked ? "#4ad493" : "default",*/}
                        {/*                    "--color": car.parked ? "#121212" : "#1f1f1f",*/}

                        {/*                }}*/}
                        {/*            >*/}
                        {/*                <IonIcon*/}
                        {/*                    slot="icon-only"*/}
                        {/*                    src = {"/park-icon-dark.svg"}*/}
                        {/*                    style={{*/}
                        {/*                        width: "41px",*/}
                        {/*                        height: "41px",*/}
                        {/*                        marginLeft: "3.5px", // Adjust left/right margin manually if needed*/}
                        {/*                        marginTop: "2px", // Adjust top/bottom margin manually if needed*/}
                        {/*                    }}*/}
                        {/*                >*/}
                        {/*                </IonIcon>*/}
                        {/*            </IonButton>*/}
                        {/*        </IonCard>*/}

                        {/*    </IonRouterLink>*/}

                        {/*))}*/}
                        {cars.map((car, idx) => (
                        <IonRouterLink key={idx} routerLink="/car-detail">
                            <IonCard className="hover-expand-search" style={{ display: "flex", "--flex-direction": "row", padding: "12px", minHeight: "200px" }}>
                                <img
                                    src={`http://localhost:5000${car.imageUrl}`}
                                    alt={car.title}
                                    style={{ width: "325px", height: "195px", objectFit: "cover" }}
                                />
                                <IonCardContent>
                                    <IonLabel>
                                        <h1>{car.title}</h1>
                                        <p>{car.make} {car.model}</p>
                                        <p>{car.mileage} km • {car.year} • {car.location}</p>
                                    </IonLabel>
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: "20px",
                                            left: "20px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px"  // space between image and username
                                        }}
                                    >
                                        <img
                                            src={`http://localhost:5000${car.ownerPfp}`}
                                            alt="Profile"
                                            style={{
                                                width: "45px",
                                                height: "45px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                                border: "2px solid #4ad493"
                                            }}
                                        />
                                        <span style={{ fontSize: "1.4rem", fontWeight: 500 }}>
                                            {car.ownerUserName}
                                        </span>

                                    </div>


                                </IonCardContent>

                                {/*<span style={{*/}
                                {/*    position: "absolute",*/}
                                {/*    top: "20px",*/}
                                {/*    right: "20px",*/}
                                {/*    fontSize: "1.32rem",*/}
                                {/*    fontWeight: "bold",*/}
                                {/*    backgroundColor: "#4ad493",*/}
                                {/*    color: "#121212",*/}
                                {/*    padding: "5px 10px",*/}
                                {/*    borderRadius: "8px"*/}
                                {/*}}>*/}
                                {/*    {car.currentBid} EURO*/}
                                {/*</span>*/}
                                {/*<CountdownTimer startTime={car.startTime} />*/}
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "20px",
                                        right: "20px",
                                        backgroundColor: "#4ad493",
                                        color: "#121212",
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "6px 12px",
                                        borderRadius: "9999px", // pill shape
                                        fontSize: "0.95rem",
                                        fontWeight: 600,
                                        gap: "10px"
                                    }}
                                >
                                    {/* Timer Icon */}
                                    <span style={{ display: "flex", alignItems: "center", fontSize: "1rem" }}>
                                        ⏱
                                    </span>

                                    {/* Countdown */}
                                    <span>
                                        <CountdownTimer startTime={car.startTime} />
                                    </span>

                                    {/* Bid Label */}
                                    <span style={{ opacity: 0.8 }}>Bid</span>

                                    <span style={{ fontWeight: 700 }}>
                                        €{Intl.NumberFormat("en-US").format(car.currentBid)}
                                    </span>
                                </div>
                            </IonCard>
                        </IonRouterLink>
                        ))}
                    </IonGrid>
                </div>
                <IonInfiniteScroll threshold="100px" onIonInfinite={async (ev) => {
                    await loadMoreCars();
                    (ev.target as HTMLIonInfiniteScrollElement).complete();
                }}>
                    <IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="Loading more cars..." />
                </IonInfiniteScroll>
            </IonContent>
        </IonPage>
    );
};

export default CarSearch;
