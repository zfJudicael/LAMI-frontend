import type { IReservationResponse } from "@/interfaces/ApiResponse";
import { ReservationAPI } from "./reservation.api";

export class ReservationService{
    static async clearReservation(): Promise<IReservationResponse>{
        return (await ReservationAPI.deleteReservation()).data
    }
}