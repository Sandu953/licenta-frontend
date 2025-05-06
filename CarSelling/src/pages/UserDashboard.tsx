import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonButtons,
    IonMenuButton,
    IonAvatar,
    IonBadge,
    IonButton,
    IonGrid,
    IonRow,
    IonCol, IonIcon,
} from '@ionic/react';
import {personOutline} from "ionicons/icons";
import React, {useEffect, useState} from "react";
import {loginUser} from "../Api";

const Dashboard: React.FC = () => {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");

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

    const handleLogout = async () => {
        localStorage.clear();
        window.location.href = "/auth";
    };

    useEffect(() => {
        updateMaxWidth();
        window.addEventListener("resize", updateMaxWidth);
        return () => window.removeEventListener("resize", updateMaxWidth);
    }, []);



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
                <div style={{ maxWidth, margin: "0 auto", padding: "10px"}}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px'
                    }}>
                        <h2 style={{ margin: 0, color: '#4ad493' }}>Welcome back, {userName}!</h2>
                        <IonButton color="danger" size="small" onClick={handleLogout}>
                            Logout
                        </IonButton>
                    </div>
                    <IonGrid>
                        <IonRow>
                            <IonCol sizeMd="4" sizeSm="12">
                                <IonCard color="dark">
                                    <IonCardHeader>
                                        <IonCardTitle>My Auctions</IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <h4 style={{ color: '#4ad493', marginBottom: '8px' }}>Active Auctions</h4>
                                        <IonList>
                                            <IonItem button>
                                                <IonLabel>
                                                    <h3>BMW 5 Series</h3>
                                                    <p>Current Bid: €45,000</p>
                                                    <p>Ends in: 2d 4h</p>
                                                </IonLabel>
                                                {/*<IonButton size="small" fill="nofill" style = {{color : "#4ad493"}}>View</IonButton>*/}
                                            </IonItem>
                                        </IonList>

                                        <h4 style={{ color: '#999', marginTop: '24px', marginBottom: '8px' }}>Past Auctions</h4>
                                        <IonList>
                                            <IonItem button>
                                                <IonLabel>
                                                    <h3>Audi A6</h3>
                                                    <p>Sold for: €42,000</p>
                                                    <p>Ended: 2 days ago</p>
                                                </IonLabel>
                                                <IonBadge color="success">Sold</IonBadge>
                                            </IonItem>
                                            <IonItem button>
                                                <IonLabel>
                                                    <h3>Ford Mustang</h3>
                                                    <p>No Bids Received</p>
                                                    <p>Ended: 3 days ago</p>
                                                </IonLabel>
                                                <IonBadge color="medium">Expired</IonBadge>
                                            </IonItem>
                                        </IonList>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>

                            <IonCol sizeMd="4" sizeSm="12">
                                <IonCard color="dark">
                                    <IonCardHeader>
                                        <IonCardTitle>My Bids</IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <h4 style={{ color: '#4ad493', marginBottom: '8px' }}>Active Bids</h4>
                                        <IonList>
                                            <IonItem button>
                                                <IonLabel>
                                                    <h3>Ferrari 812</h3>
                                                    <p>Your Bid: €90,000</p>
                                                    <p>Status: Highest</p>
                                                </IonLabel>
                                                <IonBadge color="success">Leading</IonBadge>
                                            </IonItem>
                                            <IonItem button>
                                                <IonLabel>
                                                    <h3>Audi A6</h3>
                                                    <p>Your Bid: €42,000</p>
                                                    <p>Status: Outbid</p>
                                                </IonLabel>
                                                <IonBadge color="danger">Outbid</IonBadge>
                                            </IonItem>
                                        </IonList>

                                        <h4 style={{ color: '#999', marginTop: '24px', marginBottom: '8px' }}>Past Bids</h4>
                                        <IonList>
                                            <IonItem button>
                                                <IonLabel>
                                                    <h3>BMW M4</h3>
                                                    <p>Your Bid: €60,000</p>
                                                    <p>Final Status: Lost</p>
                                                </IonLabel>
                                                <IonBadge color="medium">Ended</IonBadge>
                                            </IonItem>
                                            <IonItem button>
                                                <IonLabel>
                                                    <h3>Tesla Model Y</h3>
                                                    <p>Your Bid: €52,000</p>
                                                    <p>Final Status: Won</p>
                                                </IonLabel>
                                                <IonBadge color="success">Won</IonBadge>
                                            </IonItem>
                                        </IonList>
                                    </IonCardContent>
                                </IonCard>

                            </IonCol>

                            {/* Messages */}
                            <IonCol sizeMd="4" sizeSm="12">
                                <IonCard color="dark">
                                    <IonCardHeader>
                                        <IonCardTitle>Messages</IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <IonList>
                                            <IonItem button>
                                                <IonAvatar slot="start">
                                                    <img src="https://placehold.co/40" alt="user" />
                                                </IonAvatar>
                                                <IonLabel>
                                                    <h3>SellerMike</h3>
                                                    <p>“Still interested in the BMW?”</p>
                                                </IonLabel>
                                                <IonBadge color="success">New</IonBadge>
                                            </IonItem>
                                            <IonItem button>
                                                <IonAvatar slot="start">
                                                    <img src="https://placehold.co/40" alt="user" />
                                                </IonAvatar>
                                                <IonLabel>
                                                    <h3>AutoQueen</h3>
                                                    <p>“Let's finalize the deal!”</p>
                                                </IonLabel>
                                            </IonItem>
                                        </IonList>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Dashboard;
