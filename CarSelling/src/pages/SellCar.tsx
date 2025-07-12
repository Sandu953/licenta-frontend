import type React from "react"
import { useEffect, useState, useRef } from "react"
import {
    IonPage,
    IonHeader,
    IonToolbar,
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
    IonCardHeader,
    IonCardTitle,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonLabel,
    IonItem,
    IonChip,
     IonText,
    IonCheckbox,
    IonRadio,
    IonSpinner,
    IonAccordion,
    IonBackButton,
    IonTabBar,
    IonTabButton, IonRouterOutlet,
    IonTabs, IonFooter
} from "@ionic/react"
import { personOutline, addCircleOutline, closeCircleOutline, cameraOutline } from "ionicons/icons"
import { useHistory } from "react-router-dom"
import {carSportOutline, cashOutline, homeOutline, sparklesOutline} from 'ionicons/icons';
import "./SellCar.css"
import axios from "axios";
import {Redirect, Route, useLocation} from "react-router-dom";

const SellCar: React.FC = () => {
    const [maxWidth, setMaxWidth] = useState("1400px")
    const [isDarkMode, setIsDarkMode] = useState(window.matchMedia("(prefers-color-scheme: dark)").matches)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [images, setImages] = useState<string[]>([])
    const [features, setFeatures] = useState<string[]>([])
    const [newFeature, setNewFeature] = useState("")
    const [currentStep, setCurrentStep] = useState(1)
    const history = useHistory()
    const [vinError, setVinError] = useState("");
    const [vinConflict, setVinConflict] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [inputErrors, setInputErrors] = useState<{ [key: string]: string }>({});


    const [brands, setBrands] = useState<string[]>([]);
    const [models, setModels] = useState<string[]>([]);
    const [engineSizes, setEngineSizes] = useState<string[]>([]);
    const [fuelTypes, setFuelTypes] = useState<string[]>([]);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1969 }, (_, i) => currentYear - i);
    const [trims, setTrims] = useState<CarSpec[]>([]);

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


    interface CarSpec {
        id: number;
        make: string;
        model: string;
        trim: string;
        year: string;
        fuelType: string;
        engineSize: string;
        emissions: string;
    }

    // Form
    const [carDetails, setCarDetails] = useState({
        brand: "",
        model: "",
        year: "",
        mileage: "",
        trim: "",
        trimId: "",
        price: "",
        fuel: "",
        transmission: "",
        bodyType: "",
        engine: "",
        horsepower: "",
        description: "",
        location: "",
        reservePrice: "",
        title: "",
        vin: ""
    })

    useEffect(() => {
        if (currentStep === 4 && carDetails.vin.length === 17) {
            const token = localStorage.getItem("token");
            axios
                .get(`http://localhost:5000/api/car/verifyVinInLiveAuction/${carDetails.vin}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then(res => {
                    if (res.status === 200) {
                        setVinConflict(false);
                    } else {
                        setVinConflict(true);
                    }
                })
                .catch(err => {
                    console.error("VIN validation error:", err);
                    setVinConflict(true);
                });
        }
    }, [currentStep, carDetails.vin]);


    useEffect(() => {
        // Listen for dark mode changes dynamically
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        const handleChange = (event: MediaQueryListEvent) => setIsDarkMode(event.matches)

        mediaQuery.addEventListener("change", handleChange)
        return () => mediaQuery.removeEventListener("change", handleChange)
    }, [])

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get(" http://localhost:5000/api/car/getAllBrands",)
            .then(response => setBrands(response.data))
            .catch(error => {
                console.error("Failed to fetch brands:", error);
                if (error.response?.status === 401) {
                    localStorage.clear();
                    window.location.href = "/auth";
                }
            });
    }, []);

    useEffect(() => {
        if (carDetails.brand) {
            const token = localStorage.getItem("token");
            axios
                .get(`http://localhost:5000/api/car/getAllModels/${carDetails.brand}`,)
                .then(response => {
                    setModels(response.data);
                })
                .catch(error => {
                    console.error("Failed to fetch models:", error);
                    setModels([]);
                });
        } else {
            setModels([]);
        }
    }, [carDetails.brand]);

    useEffect(() => {
        if (carDetails.brand && carDetails.model) {
            const token = localStorage.getItem("token");
            axios
                .get(`http://localhost:5000/api/car/getAllEngineSize/${carDetails.brand}/${carDetails.model}`, )
                .then(response => {
                    setEngineSizes(response.data);
                })
                .catch(error => {
                    console.error("Failed to fetch engine sizes:", error);
                    setEngineSizes([]);
                });
        } else {
            setEngineSizes([]);
        }
    }, [carDetails.brand, carDetails.model]);

    useEffect(() => {
        if (carDetails.brand && carDetails.model && carDetails.engine) {
            const token = localStorage.getItem("token");
            axios
                .get(`http://localhost:5000/api/car/getAllFuelType/${carDetails.brand}/${carDetails.model}/${carDetails.engine}`, )
                .then(response => {
                    setFuelTypes(response.data);
                })
                .catch(error => {
                    console.error("Failed to fetch fuel types:", error);
                    setFuelTypes([]);
                });
        } else {
            setFuelTypes([]);
        }
    }, [carDetails.brand, carDetails.model, carDetails.engine]);

    useEffect(() => {
        if (carDetails.brand && carDetails.model && carDetails.engine && carDetails.fuel) {
            const token = localStorage.getItem("token");
            axios
                .get(`http://localhost:5000/api/car/getAllTrims/${carDetails.brand}/${carDetails.model}/${carDetails.engine}/${carDetails.fuel}`, )
                .then(response => {
                    setTrims(response.data);
                })
                .catch(error => {
                    console.error("Failed to fetch trims:", error);
                    setTrims([]);
                });
        } else {
            setTrims([]);
        }
    }, [carDetails.brand, carDetails.model, carDetails.engine, carDetails.fuel]);

    const updateMaxWidth = () => {
        if (window.innerWidth > 1800) {
            setMaxWidth("1600px")
        } else if (window.innerWidth > 1400) {
            setMaxWidth("1400px")
        } else if (window.innerWidth > 1200) {
            setMaxWidth("1200px")
        } else {
            setMaxWidth("100%")
        }
    }

    useEffect(() => {
        updateMaxWidth()
        window.addEventListener("resize", updateMaxWidth)
        return () => window.removeEventListener("resize", updateMaxWidth)
    }, [])

    const handleInputChange = (e: CustomEvent, field: string) => {
        let value = e.detail.value;

        // Disallow scientific notation or negatives for numeric fields
        if (["mileage", "horsepower", "price", "reservePrice"].includes(field)) {
            if (!/^\d{0,7}$/.test(value)) {
                // Golește inputul și oprește modificarea stării
                setCarDetails(prev => ({
                    ...prev,
                    [field]: ""
                }));
                return;
            }
        }
        setCarDetails({
            ...carDetails,
            [field]: e.detail.value,
        })
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setImageFiles(prev => [...prev, ...files]);

            const previews = files.map(file => URL.createObjectURL(file));
            setImages(prev => [...prev, ...previews]);
        }
    }

    const removeImage = (index: number) => {
        const newImages = [...images]
        newImages.splice(index, 1)
        setImages(newImages)
    }

    const nextStep = () => {
        setCurrentStep(currentStep + 1)
        window.scrollTo(0, 0)
    }

    const prevStep = () => {
        setCurrentStep(currentStep - 1)
        window.scrollTo(0, 0)
    }

    const handleSubmit = async () => {
        const formData = new FormData();

        formData.append("title", carDetails.title);
        formData.append("vin", carDetails.vin);
        formData.append("brand", carDetails.brand);
        formData.append("model", carDetails.model);
        formData.append("year", carDetails.year);
        formData.append("engine", carDetails.engine);
        formData.append("fuel", carDetails.fuel);
        formData.append("trim", carDetails.trim);
        formData.append("trimId", carDetails.trimId);
        formData.append("mileage", carDetails.mileage);
        formData.append("horsepower", carDetails.horsepower);
        formData.append("bodyType", carDetails.bodyType);
        formData.append("location", carDetails.location);
        formData.append("description", carDetails.description);

        // Auction
        formData.append("price", carDetails.price);
        formData.append("reservePrice", carDetails.reservePrice === "" ? "0" : carDetails.reservePrice);


        // Images
        imageFiles.forEach((file) => {
            formData.append("images", file); // this will now work
        });

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post("http://localhost:5000/api/car/upload", formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            alert("Your car has been submitted for auction!");
            window.location.href = "/dashboard";
        } catch (err) {
            console.error("Error uploading car:", err);
            alert("Something went wrong while uploading your car.");
        }
    }

    const isStep1Valid = () => {
        const requiredFields = [
            carDetails.title,
            carDetails.vin,
            carDetails.brand,
            carDetails.model,
            carDetails.year,
            carDetails.engine,
            carDetails.fuel,
            carDetails.trim,
            carDetails.mileage,
            carDetails.horsepower,
            carDetails.bodyType,
            carDetails.location,
            carDetails.description
        ];

        const allFilled = requiredFields.every(field => field !== "");
        const validVin = carDetails.vin.length === 17;

        return allFilled && validVin;
    };

    const isStep2Valid = () => images.length >= 4;

    const isStep3Valid = () => {
        const startPrice = parseFloat(carDetails.price);
        const reservePrice = parseFloat(carDetails.reservePrice);

        // starting price is required
        if (isNaN(startPrice) || startPrice <= 0) return false;

        if (carDetails.reservePrice.trim() !== "") {
            return !isNaN(reservePrice) && reservePrice > startPrice;
        }

        return true; // reserve price is optional
    };


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
                <div style={{ maxWidth, margin: "0 auto", padding: "20px" }}>
                    <h1 style={{ color: "#4ad493", marginBottom: "20px" }}>Sell Your Car</h1>

                    {/* Progress indicator */}
                    <div className="progress-container">
                        <div className="progress-step">
                            <div className={`step-circle ${currentStep >= 1 ? "active" : ""}`}>1</div>
                            <div className="step-label">Car Details</div>
                        </div>
                        <div className="progress-line"></div>
                        <div className="progress-step">
                            <div className={`step-circle ${currentStep >= 2 ? "active" : ""}`}>2</div>
                            <div className="step-label">Photos</div>
                        </div>
                        <div className="progress-line"></div>
                        <div className="progress-step">
                            <div className={`step-circle ${currentStep >= 3 ? "active" : ""}`}>3</div>
                            <div className="step-label">Auction Settings</div>
                        </div>
                        <div className="progress-line"></div>
                        <div className="progress-step">
                            <div className={`step-circle ${currentStep >= 4 ? "active" : ""}`}>4</div>
                            <div className="step-label">Review</div>
                        </div>
                    </div>

                    {/* Step 1: Basic Car Details */}
                    {currentStep === 1 && (
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Car Details</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonGrid>
                                    <IonRow>
                                        <IonCol size="12" sizeMd="6">
                                            <IonItem>
                                                <IonInput
                                                    label = "Listing Title"
                                                    labelPlacement="floating"
                                                    value={carDetails.title}
                                                    onIonChange={(e) => handleInputChange(e, "title")}
                                                    placeholder="e.g., 2020 BMW 5 Series - Excellent Condition"
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                ></IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="12" sizeMd="6">
                                            <IonItem>
                                                <IonInput
                                                    label = "VIN"
                                                    labelPlacement="floating"
                                                    value={carDetails.vin}
                                                    onIonInput={(e) => {
                                                        const vin = e.detail.value || "";
                                                        setCarDetails(prev => ({ ...prev, vin }));

                                                        if (vin.length !== 17) {
                                                            setVinError("VIN must be exactly 17 characters long");
                                                        } else {
                                                            setVinError("");
                                                        }
                                                    }}
                                                    maxlength={17}
                                                    placeholder="e.g., WBA5A7C5X0F123456"
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                ></IonInput>
                                            </IonItem>
                                            {vinError && (
                                                <IonText color="danger" style={{ marginLeft: "16px", fontSize: "14px" }}>
                                                    {vinError}
                                                </IonText>
                                            )}
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol size="12" sizeMd="6">
                                            <IonItem>
                                                <IonSelect
                                                    label="Brand"
                                                    labelPlacement="floating"
                                                    value={carDetails.brand}
                                                    onIonChange={(e) => handleInputChange(e, "brand")}
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
                                                    label="Model"
                                                    labelPlacement="floating"
                                                    value={carDetails.model}
                                                    onIonChange={(e) => handleInputChange(e, "model")}
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                >
                                                    {models.map((model, index) => (
                                                        <IonSelectOption key={index} value={model}>
                                                            {model}
                                                        </IonSelectOption>
                                                    ))}
                                                </IonSelect>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol size="12" sizeMd="6">
                                            <IonItem>
                                                <IonSelect
                                                    label="Year"
                                                    labelPlacement="floating"
                                                    value={carDetails.year}
                                                    onIonChange={(e) => handleInputChange(e, "year")}
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                >
                                                    {years.map((year) => (
                                                        <IonSelectOption key={year} value={year.toString()}>
                                                            {year}
                                                        </IonSelectOption>
                                                    ))}
                                                </IonSelect>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="12" sizeMd="6">
                                            <IonItem>
                                                <IonSelect
                                                    label = "Engine Size"
                                                    labelPlacement="floating"
                                                    value={carDetails.engine}
                                                    onIonChange={(e) => handleInputChange(e, "engine")}
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                >
                                                    {engineSizes.map((size, index) => (
                                                        <IonSelectOption key={index} value={size}>
                                                            {size} cc
                                                        </IonSelectOption>
                                                    ))}
                                                </IonSelect>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol size="12" sizeMd="6">
                                            <IonItem>
                                                <IonSelect
                                                    label="Fuel"
                                                    labelPlacement="floating"
                                                    value={carDetails.fuel}
                                                    onIonChange={(e) => handleInputChange(e, "fuel")}
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                >
                                                    {fuelTypes.map((fuel, index) => (
                                                        <IonSelectOption key={index} value={fuel}>
                                                            {fuel}
                                                        </IonSelectOption>
                                                    ))}
                                                </IonSelect>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="12" sizeMd="6">
                                            <IonItem>
                                                <IonSelect
                                                    label="Trim"
                                                    labelPlacement="floating"
                                                    value={carDetails.trimId}
                                                    onIonChange={(e) => {
                                                        const selectedId = e.detail.value.toString();
                                                        const selectedTrim = trims.find(t => t.id.toString() === selectedId);

                                                        setCarDetails(prev => ({
                                                            ...prev,
                                                            trimId: selectedTrim?.id?.toString() ?? "",
                                                            trim: selectedTrim?.trim ?? ""
                                                        }));
                                                    }}
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                >
                                                    {trims.map((spec) => (
                                                        <IonSelectOption key={spec.id} value={spec.id.toString()}>
                                                            {spec.trim}
                                                        </IonSelectOption>
                                                    ))}
                                                </IonSelect>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol size="12" sizeMd="6">
                                            <IonItem>
                                                <IonInput
                                                    label="Mileage (KM)"
                                                    labelPlacement="floating"
                                                    type="number"
                                                    min={0}
                                                    value={carDetails.mileage}
                                                    onIonChange={(e) => handleInputChange(e, "mileage")}
                                                    placeholder="e.g., 50000"
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                ></IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="12" sizeMd="6">
                                            <IonItem>
                                                <IonInput
                                                    label="Horsepower"
                                                    labelPlacement="floating"
                                                    type="number"
                                                    min={0}
                                                    value={carDetails.horsepower}
                                                    onIonChange={(e) => handleInputChange(e, "horsepower")}
                                                    placeholder="e.g., 450"
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                ></IonInput>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol size="12" sizeMd="6">
                                            <IonItem>
                                                <IonSelect
                                                    label="Body Type"
                                                    labelPlacement="floating"
                                                    value={carDetails.bodyType}
                                                    onIonChange={(e) => handleInputChange(e, "bodyType")}
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
                                        <IonCol size="12" sizeMd="6">
                                            <IonItem>
                                                <IonInput
                                                    label="Location"
                                                    labelPlacement="floating"
                                                    value={carDetails.location}
                                                    onIonChange={(e) => handleInputChange(e, "location")}
                                                    placeholder="e.g., Berlin, Germany"
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                ></IonInput>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol size="12">
                                            <IonItem>
                                                <IonTextarea
                                                    label="Description"
                                                    labelPlacement="floating"
                                                    value={carDetails.description}
                                                    onIonChange={(e) => handleInputChange(e, "description")}
                                                    placeholder="Describe your car in detail. Include condition, history, modifications, etc."
                                                    rows={6}
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                ></IonTextarea>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                                <div className="button-container">
                                    <IonButton onClick={nextStep} disabled={!isStep1Valid()} style={{ "--background": "#4ad493" }}>
                                        Next: Photos
                                    </IonButton>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    )}

                    {/* Step 2: Photos & Features */}
                    {currentStep === 2 && (
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Photos</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <h3>Upload Photos</h3>
                                <p>High-quality photos increase your chances of selling. Add at least 4 photos.</p>

                                <div className="photo-upload-container">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        multiple
                                        accept="image/*"
                                        style={{ display: "none" }}
                                    />
                                    <div className="photo-grid">
                                        {images.map((image, index) => (
                                            <div key={index} className="photo-item">
                                                <img src={image || "/placeholder.svg"} alt={`Car upload ${index + 1}`} />
                                                <button className="remove-photo" onClick={() => removeImage(index)}>
                                                    <IonIcon icon={closeCircleOutline} />
                                                </button>
                                            </div>
                                        ))}
                                        <div className="add-photo-button" onClick={() => fileInputRef.current?.click()}>
                                            <IonIcon icon={cameraOutline} />
                                            <span>Add Photo</span>
                                        </div>
                                    </div>
                                </div>
                                {images.length < 4 && (
                                    <IonText color="danger" style={{ marginTop: "8px", display: "block" }}>
                                        Please upload at least 4 photos to continue.
                                    </IonText>
                                )}
                                <div className="button-container">
                                    <IonButton onClick={prevStep} fill="clear" style={{ "--color": "#4ad493" }}>
                                        Back
                                    </IonButton>
                                    <IonButton onClick={nextStep} disabled={!isStep2Valid()} style={{ "--background": "#4ad493" }}>
                                        Next: Auction Settings
                                    </IonButton>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    )}

                    {/* Step 3: Auction Settings */}
                    {currentStep === 3 && (
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Auction Settings</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonGrid>
                                    <IonRow>
                                        <IonCol size="12" sizeMd="6">
                                            <IonItem>
                                                <IonInput
                                                    label="Starting Price (EUR)"
                                                    labelPlacement="floating"
                                                    type="number"
                                                    min={0}
                                                    value={carDetails.price}
                                                    onIonChange={(e) => handleInputChange(e, "price")}
                                                    placeholder="e.g., 45000"
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                ></IonInput>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="12" sizeMd="6">
                                            <IonItem>
                                                <IonInput
                                                    label="Reserve Price (EUR, optional)"
                                                    labelPlacement="floating"
                                                    type="number"
                                                    min={0}
                                                    value={carDetails.reservePrice}
                                                    onIonChange={(e) => handleInputChange(e, "reservePrice")}
                                                    placeholder="Minimum price you'll accept"
                                                    style={{ "--highlight-color-focused": "#4ad493" }}
                                                ></IonInput>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                    {carDetails.reservePrice.trim() !== "" &&
                                        parseFloat(carDetails.reservePrice) <= parseFloat(carDetails.price) && (
                                            <IonText color="danger" style={{ marginLeft: "16px", fontSize: "14px" }}>
                                                Reserve price must be greater than starting price
                                            </IonText>
                                        )}
                                </IonGrid>

                                <div className="button-container">
                                    <IonButton onClick={prevStep} fill="clear" style={{ "--color": "#4ad493" }}>
                                        Back
                                    </IonButton>
                                    <IonButton onClick={nextStep} disabled={!isStep3Valid()} style={{ "--background": "#4ad493" }}>
                                        Next: Review
                                    </IonButton>
                                </div>
                            </IonCardContent>
                        </IonCard>
                    )}

                    {/* Step 4: Review */}
                    {currentStep === 4 && (
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Review Your Listing</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <div className="review-section">
                                    <h3>Car Details</h3>
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol size="12" sizeMd="6">
                                                <p>
                                                    <strong>Title:</strong> {carDetails.title || "Not provided"}
                                                </p>
                                                <p>
                                                    <strong>Brand:</strong> {carDetails.brand || "Not provided"}
                                                </p>
                                                <p>
                                                    <strong>Model:</strong> {carDetails.model || "Not provided"}
                                                </p>
                                                <p>
                                                    <strong>Year:</strong> {carDetails.year || "Not provided"}
                                                </p>
                                                <p>
                                                    <strong>Mileage:</strong> {carDetails.mileage ? `${carDetails.mileage} KM` : "Not provided"}
                                                </p>
                                                <p>
                                                    <strong>Location:</strong> {carDetails.location || "Not provided"}
                                                </p>
                                            </IonCol>
                                            <IonCol size="12" sizeMd="6">
                                                <p>
                                                    <strong>VIN:</strong> {carDetails.vin || "Not provided"}
                                                </p>
                                                <p>
                                                    <strong>Fuel Type:</strong> {carDetails.fuel || "Not provided"}
                                                </p>
                                                <p>
                                                    <strong>Trim:</strong> {carDetails.trim || "Not provided"}
                                                </p>
                                                <p>
                                                    <strong>Body Type:</strong> {carDetails.bodyType || "Not provided"}
                                                </p>
                                                <p>
                                                    <strong>Engine:</strong> {carDetails.engine || "Not provided"} <strong> cc</strong>
                                                </p>
                                                <p>
                                                    <strong>Horsepower:</strong>{" "}
                                                    {carDetails.horsepower ? `${carDetails.horsepower} HP` : "Not provided"}
                                                </p>
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </div>

                                <div className="review-section">
                                    <h3>Description</h3>
                                    <p>{carDetails.description || "No description provided."}</p>
                                </div>

                                <div className="review-section">
                                    <h3>Photos</h3>
                                    {images.length > 0 ? (
                                        <div className="photo-grid review-photos">
                                            {images.map((image, index) => (
                                                <div key={index} className="photo-item">
                                                    <img src={image || "/placeholder.svg"} alt={`Car upload ${index + 1}`} />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No photos uploaded.</p>
                                    )}
                                </div>

                                <div className="review-section">
                                    <h3>Auction Settings</h3>
                                    <p>
                                        <strong>Starting Price:</strong> {carDetails.price ? `€${carDetails.price}` : "Not provided"}
                                    </p>
                                    <p>
                                        <strong>Reserve Price:</strong>{" "}
                                        {carDetails.reservePrice ? `€${carDetails.reservePrice}` : "No reserve"}
                                    </p>
                                </div>

                                {vinConflict && (
                                <IonText color="danger">
                                    <p style={{ marginLeft: "16px", fontSize: "14px" }}>
                                        This VIN is already listed in another live auction.
                                    </p>
                                </IonText>
                            )}

                                <div className="button-container">
                                    <IonButton onClick={prevStep} fill="clear" style={{ "--color": "#4ad493" }}>
                                        Back
                                    </IonButton>
                                    <IonButton onClick={handleSubmit} disabled={vinConflict} style={{ "--background": "#4ad493" }}>
                                        Submit Auction
                                    </IonButton>
                                </div>

                            </IonCardContent>
                        </IonCard>
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
    )
}

export default SellCar
