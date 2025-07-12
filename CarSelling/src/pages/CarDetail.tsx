import React, {useEffect, useRef, useState} from "react";
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonImg,
    IonIcon, IonText, IonTextarea,
    IonCheckbox,
    IonRadio,
    IonSpinner,
    IonAccordion,
    IonBackButton,
    IonSelect,
    IonToggle,
    IonTabBar,
    IonTabButton, IonRouterOutlet,
    IonTabs, IonFooter, IonModal, IonChip

} from "@ionic/react";

import { personOutline } from "ionicons/icons";
import {carSportOutline, cashOutline, homeOutline, sparklesOutline} from 'ionicons/icons';
import { speedometerOutline, calendarOutline, hardwareChipOutline, flashOutline , constructOutline} from 'ionicons/icons';


import Countdown from 'react-countdown';

import connection from "../signalR";
import {Redirect, Route, useHistory, useLocation} from "react-router-dom";

import { HubConnectionState } from "@microsoft/signalr";

// Import Swiper React components and styles
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import 'swiper/css/zoom';
import SwiperCore from "swiper";
import {Pagination } from "swiper/modules";
import {Navigation, Zoom} from "swiper/modules";
import {useParams} from "react-router";
import axios from "axios";
import {ConsoleLogger} from "@microsoft/signalr/dist/esm/Utils";

// Install Swiper modules
SwiperCore.use([Pagination,Navigation]);

const CarDetail: React.FC = () => {
    const [maxWidth, setMaxWidth] = useState("1400px");
    const [isDarkMode, setIsDarkMode] = useState(window.matchMedia("(prefers-color-scheme: dark)").matches);

    const isLoggedIn = !!localStorage.getItem("token"); // or userId if you prefer

    const arrowBackground = isDarkMode ? "#333" : "#fff";
    const arrowColor = isDarkMode ? "#fff" : "#121212";

    const [auction, setAuction] = useState<AuctionDetails | null>(null);

    const BASE_URL = "http://localhost:5000";

    const { id } = useParams<{ id: string }>();

    const [activity, setActivity] = useState<ActivityItem[]>([]);

    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const connectionStarted = useRef(false);

    const [highestBid, setHighestBid] = useState<number | null>(null);

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const currentUserId = parseInt(localStorage.getItem("userId") || "0");



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


    interface Comment {
        userId: number;
        userName: string;
        text: string;
        timestamp: string;
    }

    interface Bid {
        userId: number;
        userName: string;
        amount: number;
        timestamp: string;
    }


    type ActivityItem = {
        type: "bid" | "comment";
        userId: number;
        userName: string;
        content: string;
        timestamp: string;
    };

    const [newBid, setNewBid] = useState("");
    const [isSubmittingBid, setIsSubmittingBid] = useState(false);


    function calculateSoftCloseEndTime(
        bids: { timestamp: string }[],
        startTime?: string
    ): Date | null {
        if (!startTime) return null;

        const sorted = [...bids].sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        let endTime = new Date(new Date(startTime).getTime() + 7 * 24 * 60 * 60 * 1000);

        for (const bid of sorted) {
            const bidTime = new Date(bid.timestamp);
            const timeLeft = endTime.getTime() - bidTime.getTime();

            if (timeLeft <= 60_000) {
                endTime = new Date(endTime.getTime() + 60_000);
            }
        }
        return endTime;
    }


    const bidsOnly = activity
        .filter((a) => a.type === "bid")
        .map((bid) => ({
            ...bid,
            amount: extractAmountFromContent(bid.content),
        }));

    const endTime = calculateSoftCloseEndTime(bidsOnly, auction?.startTime);

    const isAuctionOver = endTime !== null && Date.now() > endTime.getTime();
    const isOwner = auction?.sellerUserName === localStorage.getItem("userName");

    const disableBidButton = isAuctionOver || isOwner;

    function extractAmountFromContent(content: string): number {
        const match = content.match(/\$([\d,]+)/);
        if (!match) return 0;
        const numeric = match[1].replace(/,/g, ""); // remove commas
        return parseInt(numeric, 10);
    }

    const winningBid = bidsOnly.length
        ? bidsOnly.reduce((max, bid) => (bid.amount > max.amount ? bid : max))
        : null;


    const isCurrentUserWinning = winningBid?.userId === currentUserId;


    console.log("Winning bid:", winningBid);

    const reservePriceMet =
        winningBid && auction?.reservePrice !== undefined && winningBid.amount >= auction?.reservePrice;

    console.log("Reserve price met:", reservePriceMet);


    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [bidsRes, commentsRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/bids/${id}`),
                    axios.get(`http://localhost:5000/api/comments/${id}`)
                ]);

                const bidsOnly: Bid[] = bidsRes.data;

                const currentMax = bidsOnly.length > 0
                    ? Math.max(...bidsOnly.map(b => b.amount))
                    : null;

                setHighestBid(currentMax);

                const normalizedBids: ActivityItem[] = bidsRes.data.map((bid: Bid) => ({
                    type: "bid",
                    userId: bid.userId,
                    userName: bid.userName,
                    content: `Bid $${bid.amount.toLocaleString()}`,
                    timestamp: bid.timestamp
                }));

                const normalizedComments: ActivityItem[] = commentsRes.data.map((comment: Comment) => ({
                    type: "comment",
                    userId: comment.userId,
                    userName: comment.userName,
                    content: comment.text,
                    timestamp: comment.timestamp
                }));

                const merged = [...normalizedBids, ...normalizedComments].sort(
                    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );

                setActivity(merged);
            } catch (err) {
                console.error("Failed to load bids or comments", err);
            }
        };

        fetchAll();
    }, [id]);

    useEffect(() => {
        console.log("🧾 Activity updated:", activity);
    }, [activity]);


    const handleNewBid = (data: {
        auctionId: number;
        amount: number;
        userId: number;
        userName: string;
        timestamp: string;
    }) => {
        console.log("📩 Received new bid via SignalR:", data);
        console.log("📩 Received bid with timestamp:", data.timestamp);
        if (parseInt(id) === data.auctionId) {
            const newBid: ActivityItem = {
                type: "bid",
                userId: data.userId,
                userName: data.userName,
                content: `Bid $${data.amount.toLocaleString()}`,
                timestamp: data.timestamp
            };
            setHighestBid(prev =>
                prev === null || data.amount > prev ? data.amount : prev
            );

            setActivity(prev => [newBid, ...prev]);
        }
    };

    const handleNewComment = (data: {
        auctionId: number;
        text: string;
        userId: number;
        userName: string;
        timestamp: string;
    }) => {
        console.log("📩 Received new comment via SignalR:", data);
        console.log("📩 Received comment with timestamp:", data.timestamp);

        if (parseInt(id) === data.auctionId) {
            const newComment: ActivityItem = {
                type: "comment",
                userId: data.userId,
                userName: data.userName,
                content: data.text,
                timestamp: data.timestamp
            };
            setActivity(prev => [newComment, ...prev]);
        }
    };


    useEffect(() => {
        const startConnection = async () => {
            try {
                connection.onclose(err => console.warn(" Connection closed:", err));
                connection.onreconnecting(() => console.warn(" Reconnecting..."));
                connection.onreconnected(() => console.log(" Reconnected"));


                if (connection.state === HubConnectionState.Disconnected && !connectionStarted.current) {
                    connectionStarted.current = true;
                    console.log(" Starting SignalR connection...");
                    await connection.start();
                    console.log(" SignalR connected");
                }

                console.log(" SignalR connection state:", connection.state);


                if (connection.state === HubConnectionState.Connected) {
                    await connection.invoke("JoinAuctionGroup", id);
                    console.log(` Joined SignalR group: auction-${id}`);
                } else {
                    console.warn(" SignalR not connected. Cannot join group.");
                }

                connection.off("ReceiveNewComment", handleNewComment);
                connection.off("ReceiveNewBid", handleNewBid);

                connection.on("ReceiveNewBid", handleNewBid);
                connection.on("ReceiveNewComment", handleNewComment);

            } catch (err) {
                console.error(" SignalR start/join error:", err);
                connectionStarted.current = false; // allow retry on next load
            }
        };


        startConnection();

        return () => {
            connection.off("ReceiveNewBid", handleNewBid);
            connection.off("ReceiveNewComment", handleNewComment);

            if (connection.state === HubConnectionState.Connected) {
                connection.invoke("LeaveAuctionGroup", id).catch(console.error);
                connection.stop().then(() => {
                    console.log("🔌 SignalR stopped.");
                    connectionStarted.current = false;
                }).catch(console.error);
            }
        };
    }, [id]);



    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;

        setIsSubmitting(true);

        try {
            console.log({ AuctionId: parseInt(id),   // from useParams
                UserId:  parseInt(localStorage.getItem("userId") || "0"),
                UserName: localStorage.getItem("userName"),
                Text: newComment})

            await axios.post(`http://localhost:5000/api/comments`, {
                AuctionId: parseInt(id),
                UserId:  parseInt(localStorage.getItem("userId") || "0") ,
                UserName: localStorage.getItem("userName"),
                Text: newComment
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            setNewComment("");
        } catch (err) {
            console.error("Failed to post comment", err);
            alert("Failed to send comment.");
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleBidSubmit = async () => {
        const bidAmount = parseInt(newBid.trim());
        if (!bidAmount || isNaN(bidAmount)) return;

        if (highestBid !== null && bidAmount <= highestBid) {
            alert("Bid must be higher than current bid!");
            return;
        }

        setIsSubmittingBid(true);

        try {
            await axios.post("http://localhost:5000/api/bids", {
                AuctionId: parseInt(id),
                UserId: parseInt(localStorage.getItem("userId") || "0"),
                UserName: localStorage.getItem("userName") || "User",
                Amount: bidAmount
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            setNewBid("");
        } catch (err) {
            console.error("❌ Failed to place bid:", err);
            alert("Failed to place bid. Maybe too low?");
        } finally {
            setIsSubmittingBid(false);
        }
    };


    interface AuctionDetails {
        id: number;
        title?: string;
        make?: string;
        model?: string;
        sellerUserName: string;
        sellerId?: number;
        location?: string;
        year?: number;
        mileage?: number;
        startTime?: string;
        imagesUrl?: string[];
        isFavorite?: boolean;
        description?: string;
        vin: string;
        bodyType: string;
        fuelType: string;
        engineSize?: number;
        power: number;
        startingPrice?: number;
        reservePrice? : number;
    }


    useEffect(() => {
        axios.get(`http://localhost:5000/api/auctions/${id}`)
            .then(res => setAuction(res.data))
            .catch(err => console.error("Failed to load auction", err));
    }, [id]);

    useEffect(() => {
        const logInteraction = async () => {
            if (!auction?.id) return;

            try {
                await axios.post("http://localhost:5000/api/user-interactions", {
                    UserId: localStorage.getItem("userId"),
                    AuctionId: auction.id
                });
            } catch (error) {
                console.error("Failed to log interaction", error);
            }
        };

        logInteraction();
    }, [auction?.id]);

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

            {/* Content */}
            <IonContent fullscreen>
                <style>
                    {`
            /* Make the arrows circular and use dynamic background/color */
            .swiper-button-prev, .swiper-button-next {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              --swiper-navigation-size: 20px; /* size of arrow icon */
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              background-color: ${arrowBackground} !important;
              color: ${arrowColor} !important;
            }
            
            .swiper-button-prev {
                left: 20px !important;
            }
                
            .swiper-button-next {
                right: 20px !important;
            }

            /* Customize pagination bullets */
            .swiper-pagination-bullet {
              background: #4ad493 !important; /* default bullet color */
              opacity: 0.6;
            }
            .swiper-pagination-bullet-active {
              background: #4ad493 !important; /* active bullet color */
              opacity: 1;
            }
          `}
                </style>
                <div style={{ maxWidth, margin: "0 auto", padding: "16px" }}>
                    <IonGrid>

                        <IonRow>
                            <IonCol size="12" size-md="8">
                                {auction?.imagesUrl && auction.imagesUrl.length > 0 ? (


                                    <Swiper
                                        spaceBetween={10}
                                        slidesPerView={1}
                                        navigation={true}
                                        initialSlide={0}
                                        speed={400}
                                    >
                                        {auction.imagesUrl.map((src, index) => (
                                            <SwiperSlide key={index}>
                                                <IonCard style={{ borderRadius: "12px", overflow: "hidden" }}>
                                                    <div
                                                        style={{
                                                            position: "relative",
                                                            width: "100%",
                                                            paddingTop: "80%", // 4:3 aspect ratio
                                                            maxHeight: "50vh",
                                                            borderRadius: "12px",
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        <img
                                                            src={`${BASE_URL}${src}`}
                                                            alt={`Car Image ${index + 1}`}
                                                            style={{
                                                                position: "absolute",
                                                                top: 0,
                                                                left: 0,
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "cover",
                                                            }}
                                                        />
                                                    </div>
                                                </IonCard>

                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                ) : (
                                    <IonText>No images available</IonText>
                                )}
                            </IonCol>

                            {/* Car Details (Right Side) */}
                            <IonCol size="12" size-md="4">
                                <h1 style={{

                                    fontSize: "2rem",
                                    fontWeight: "bold",
                                    margin: 0,
                                    marginTop : "10px",
                                    marginBottom : "20px"

                                }}>
                                    {auction?.make} {auction?.model}
                                </h1>
                                <IonCard>
                                    <IonCardContent>
                                        {endTime && (
                                            new Date() > endTime ? (
                                                <IonText color="danger" />
                                            ) : (
                                                <Countdown
                                                    date={endTime}
                                                    onComplete={() => {
                                                        setTimeout(() => window.location.reload(), 1000);
                                                    }}
                                                    renderer={({ days, hours, minutes, seconds }) => (
                                                        <IonText color={days === 0 && hours === 0 ? "danger" : "primary"}>
                                                            <p style={{ fontSize: "1rem", color: "#888", marginTop: "4px" }}>
                                                                Time remaining
                                                            </p>
                                                            <h2 style={{
                                                                fontWeight: 'bold',
                                                                fontSize: '1.5rem',
                                                                color: days === 0 && hours === 0 ? '#d9534f' : '#4ad493',
                                                                margin: 0,
                                                            }}>
                                                                {days}d {hours}h {minutes}m {seconds}s
                                                            </h2>

                                                        </IonText>
                                                    )}
                                                />
                                            )
                                        )}
                                    </IonCardContent>

                                    <IonCardContent style={{ padding: "1rem" }}>
                                        {isAuctionOver ? (
                                            <>
                                                <IonText color="danger">
                                                    <h2 style={{ fontWeight: "bold", fontSize: "1.4rem", marginBottom: "1.4rem" }}>
                                                         Auction Ended
                                                    </h2>
                                                </IonText>

                                                <div style={{ marginBottom: "1rem" }}>
                                                    <IonText
                                                        color="success"
                                                        style={{ fontSize: "1.3rem", fontWeight: "bold", display: "block",marginBottom: "1.4rem"   }}
                                                    >
                                                        {winningBid ? "Final Bid" : "Starting Price"}:&nbsp;
                                                        {winningBid
                                                            ? `$${winningBid.amount.toLocaleString()}`
                                                            : `$${auction?.startingPrice?.toLocaleString()}`}
                                                    </IonText>
                                                </div>

                                                {winningBid ? (
                                                    reservePriceMet ? (
                                                        <IonText color="success">
                                                            <p style={{ margin: "0.5rem 0", fontSize: "1rem" }}>
                                                                 <strong>{winningBid.userName}</strong> won the auction with{" "}
                                                                <strong>{winningBid.content}</strong>
                                                            </p>
                                                        </IonText>
                                                    ) : (
                                                        <IonText color="warning">
                                                            <p style={{ margin: "0.5rem 0", fontSize: "1rem" }}>
                                                                 Reserve price not met — no winner declared
                                                            </p>
                                                        </IonText>
                                                    )
                                                ) : (
                                                    <IonText color="medium">
                                                        <p style={{ margin: "0.5rem 0", fontSize: "1rem" }}>
                                                             No bids were placed — auction expired
                                                        </p>
                                                    </IonText>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <div style={{ marginBottom: "1rem" }}>
                                                    <IonText
                                                        style={{
                                                            fontSize: "1.3rem",
                                                            fontWeight: "bold",
                                                            color: "#4ad493",
                                                            display: "block",
                                                        }}
                                                    >
                                                         Current Bid:&nbsp;
                                                        {winningBid
                                                            ? `$${winningBid.amount.toLocaleString()}`
                                                            : `$${auction?.startingPrice?.toLocaleString()}`}
                                                    </IonText>

                                                    {isCurrentUserWinning && (
                                                        <IonText>
                                                            <p style={{ fontWeight: "bold", fontSize: "1rem", marginTop: "0.5rem" }}>
                                                                You are currently the{" "}
                                                                <span style={{ color: "#4ad493" }}>highest</span> bidder!
                                                            </p>
                                                        </IonText>
                                                    )}
                                                </div>

                                                {!isLoggedIn ? (
                                                    <IonText color="medium">
                                                        <p style={{ fontStyle: "italic" }}>
                                                             Please log in to place a bid.
                                                        </p>
                                                        <IonButton routerLink="/auth" expand="block" style={{ "--background": "#4ad493", color: "#121212", fontWeight: "bold" }}>
                                                            Log In
                                                        </IonButton>
                                                    </IonText>
                                                ) : !isOwner ? (
                                                    <>
                                                        <IonTextarea
                                                            autoGrow
                                                            placeholder="Enter your bid (e.g., 10500)"
                                                            value={newBid}
                                                            onIonChange={(e) => setNewBid(e.detail.value!)}
                                                            style={{
                                                                marginBottom: "0.75rem",
                                                                border: "1px solid #ccc",
                                                                borderRadius: "8px",
                                                                padding: "0.5rem",
                                                                fontSize: "1rem",
                                                            }}
                                                        />

                                                        <IonButton
                                                            expand="block"
                                                            onClick={handleBidSubmit}
                                                            disabled={isSubmittingBid || !newBid.trim()}
                                                            style={{
                                                                color: "#121212",
                                                                fontWeight: "bold",
                                                                borderRadius: "8px",
                                                                "--background": "#4ad493",
                                                            }}
                                                        >
                                                            {isSubmittingBid ? (
                                                                <>
                                                                    <IonSpinner name="dots" style={{ marginRight: "8px" }} />
                                                                    Sending...
                                                                </>
                                                            ) : (
                                                                " Place Bid"
                                                            )}
                                                        </IonButton>
                                                    </>
                                                ) : (
                                                    <>
                                                        <IonText color="medium">
                                                            <p style={{ fontStyle: "italic", marginTop: "0.75rem", fontSize: "1.3rem" }}>
                                                                You cannot bid on your own auction
                                                            </p>
                                                        </IonText>

                                                        <IonText
                                                            color={reservePriceMet ? "success" : "warning"}
                                                            style={{ fontSize: "1.2rem", marginTop: "0.5rem", fontWeight: "bold" }}
                                                        >
                                                            <p style={{ margin: 0, fontSize: "1.2rem" }}>
                                                                {reservePriceMet
                                                                    ? "Reserve price met"
                                                                    : "Reserve price not met"}
                                                            </p>
                                                        </IonText>

                                                        <IonText color="medium">
                                                            <p style={{ margin: 0, fontSize: "1.2rem" }}>
                                                                Reserve: <strong>${auction?.reservePrice?.toLocaleString()}</strong>
                                                            </p>
                                                        </IonText>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </IonCardContent>
                                </IonCard>

                                <IonCard>
                                    <IonCardContent>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                gap: "1rem",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            {/* Seller Info */}
                                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                                <img
                                                    src={`http://localhost:5000/profile-pictures/user_${auction?.sellerId}.png`}
                                                    alt="Seller avatar"
                                                    style={{
                                                        width: "72px",
                                                        height: "72px",
                                                        borderRadius: "50%",
                                                        objectFit: "cover",
                                                        border: "2px solid #4ad493",
                                                    }}
                                                />
                                                <div>
                                                    <p style={{ margin: 0, fontSize: "1.2rem", color: "#ccc" }}>
                                                        <strong>Seller:</strong> {auction?.sellerUserName}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Location */}
                                            <div style={{ textAlign: "right" }}>
                                                <IonText color="medium" style={{ fontSize: "1.2rem" }}>
                                                    <strong>Location:</strong> {auction?.location}
                                                </IonText>
                                            </div>
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        </IonRow>

                        <IonCard style={{
                            background: isDarkMode ? '#1e1e1e' : '#ffffff',
                            borderRadius: '12px',
                            padding: '12px',
                            color: isDarkMode ? '#ccc' : '#222',
                            marginBottom: '16px',
                            transition: 'background 0.3s, color 0.3s'
                        }}>
                            <IonCardContent style={{ padding: 0 }}>
                                <IonRow style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                        <IonCol size="6" sizeMd="3" style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '4px',
                                            padding: '8px 0',
                                            fontSize: '18px'
                                        }}>
                                            <IonIcon icon={speedometerOutline} style={{ fontSize: '20px' }} />
                                            <span>{auction?.mileage?.toLocaleString()} km</span>
                                        </IonCol>

                                        <IonCol size="6" sizeMd="3" style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '4px',
                                            padding: '8px 0',
                                            fontSize: '18px'
                                        }}>
                                            <IonIcon icon={flashOutline} style={{ fontSize: '20px' }} />
                                            <span>{auction?.power} hp</span>
                                        </IonCol>

                                        <IonCol size="6" sizeMd="3" style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '4px',
                                            padding: '8px 0',
                                            fontSize: '18px'
                                        }}>
                                            <IonIcon icon={carSportOutline} style={{ fontSize: '20px' }} />

                                            <span>{auction?.engineSize} cm</span>
                                        </IonCol>

                                        <IonCol size="6" sizeMd="3" style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '4px',
                                            padding: '8px 0',
                                            fontSize: '18px'
                                        }}>
                                            <IonIcon icon={calendarOutline} style={{ fontSize: '20px' }} />
                                            <span>{auction?.year}</span>
                                        </IonCol>
                                </IonRow>
                            </IonCardContent>
                        </IonCard>


                        <IonCard style={{
                            background: isDarkMode ? '#1e1e1e' : '#ffffff',
                            borderRadius: '12px',
                            color: isDarkMode ? '#ccc' : '#222',
                            padding: '12px',
                            marginBottom: '16px',
                            transition: '0.3s ease all'
                        }}>
                            <IonCardContent style={{ padding: 0 }}>
                                <IonRow>
                                    <IonCol size="12">
                                        <h3 style={{
                                            margin: '0 0 8px 0',
                                            fontSize: '18px',
                                            color: isDarkMode ? '#f0f0f0' : '#111',
                                            borderBottom: isDarkMode ? '1px solid #333' : '1px solid #eee',
                                            paddingBottom: '6px'
                                        }}>
                                            Seller Description
                                        </h3>
                                        <p style={{
                                            fontSize: '16px',
                                            lineHeight: '1.6',
                                            margin: 0,
                                            whiteSpace: 'pre-wrap',
                                            color: isDarkMode ? '#ccc' : '#444'
                                        }}>
                                            {auction?.description}
                                        </p>
                                    </IonCol>
                                </IonRow>
                            </IonCardContent>
                        </IonCard>

                        <IonCard style={{
                            background: isDarkMode ? '#1e1e1e' : '#ffffff',
                            borderRadius: '12px',
                            color: isDarkMode ? '#ccc' : '#222',
                            padding: '12px',
                            marginBottom: '16px',
                            transition: '0.3s ease all'}}>
                            <IonCardContent>

                                {isLoggedIn ? (
                                    <>
                                        <IonTextarea
                                            autoGrow
                                            placeholder="Write a comment..."
                                            value={newComment}
                                            onIonChange={(e) => setNewComment(e.detail.value!)}
                                        />
                                        <IonButton
                                            expand="block"
                                            onClick={handleCommentSubmit}
                                            disabled={isSubmitting || !newComment.trim()}
                                            style={{ marginTop: "10px", "--background": "#4ad493"}}
                                        >
                                            {isSubmitting ? "Sending..." : "Post Comment"}
                                        </IonButton>
                                    </>
                                ) : (
                                    <IonText color="medium">
                                        <p style={{ fontStyle: "italic" }}>
                                            Please log in to comment on this auction.
                                        </p>
                                        <IonButton routerLink="/auth" expand="block" style={{ "--background": "#4ad493", color: "#121212", fontWeight: "bold" }}>
                                            Log In
                                        </IonButton>
                                    </IonText>
                                )}
                            </IonCardContent>
                        </IonCard>


                        <IonRow>
                            <IonCol size="12">
                                <h2>Comments & Bids</h2>
                                {activity.length === 0 ? (
                                    <p>No activity yet.</p>
                                ) : (
                                    activity.map((item, index) => {
                                        const isOwner = item.userId === auction?.sellerId;

                                        return (
                                            <IonCard
                                                key={`${item.type}-${item.timestamp}-${index}`}
                                                color={item.type === "bid" ? "light" : undefined}
                                            >
                                                <IonCardContent>
                                                    <strong>
                                                        {item.userName}
                                                        {isOwner && (
                                                            <IonText color="warning" style={{ marginLeft: 6 }}>
                                                                (owner)
                                                            </IonText>
                                                        )}
                                                    </strong>{" "}

                                                    {item.type === "bid" ? (
                                                        <span style={{ color: "#4ad493", fontWeight: 600 }}>{item.content}</span>
                                                    ) : (
                                                        <span>: {item.content}</span>
                                                    )}

                                                    <p style={{ fontSize: "0.8rem", color: "#999" }}>
                                                        {new Date(item.timestamp).toLocaleString()}
                                                    </p>
                                                </IonCardContent>
                                            </IonCard>
                                        );
                                    })
                                )}
                            </IonCol>

                        </IonRow>
                    </IonGrid>
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

export default CarDetail;
