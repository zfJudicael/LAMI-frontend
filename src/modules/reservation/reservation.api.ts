import type { IReservationResponse } from "@/interfaces/ApiResponse";
import { lamiAPI } from "@/services/axios.services";

export class ReservationAPI{
    static async deleteReservation(): Promise<{data: IReservationResponse}>{
        return lamiAPI.delete('/reservation')
    }
}