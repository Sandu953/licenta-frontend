import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5000/hubs/auction") // adjust this to your backend
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

export default connection;