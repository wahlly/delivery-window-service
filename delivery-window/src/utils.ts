import { start } from "repl"

export const parseTimeRanges = (timeRange: string) => {
      return timeRange.split(",").map(timeSession => {
            const [start, end] = timeSession.trim().split("-")
            return [start, end]
      })
}

// export const timeAvailabilityIntersection = (venueOpeningHours: string[][], courierDeliveryHours: string[][]) => {
//       let result = ""
//       for(const [venueStartTime, venueEndTime] of venueOpeningHours){
//             for(const [courierStartTime, courierEndTime] of courierDeliveryHours) {
//                   const formatVenueStartTime = Number(venueStartTime.split(":").join(""))
//                   const formatVenueEndTime = Number(venueEndTime.split(":").join(""))
//                   const formatCourierStartTime = Number(courierStartTime.split(":").join(""))
//                   const formatCourierEndTime = Number(courierEndTime.split(":").join(""))
//                   let start: string
//                   let end: string
//                   let start_int: number
//                   let end_int: number

//                   if(formatVenueStartTime > formatCourierEndTime) {
//                         continue
//                   }

//                   if(formatVenueStartTime > formatCourierStartTime) {
//                         start = venueStartTime
//                         start_int = formatVenueStartTime
//                   } else{
//                         start = courierStartTime
//                         start_int = formatCourierStartTime
//                   }

//                   if(formatVenueEndTime < formatCourierEndTime) {
//                         end = venueEndTime
//                         end_int = formatVenueEndTime
//                   } else{
//                         end = courierEndTime
//                         end_int = formatCourierEndTime
//                   }

//                   if(end_int - start_int > 30) { //check if its a valid time range, and time range difference is greater than 30
//                         if(result == "") {
//                               result += `${start}-${end}`
//                         } else{
//                               result += `, ${start}-${end}`
//                         }
//                   }
//             }
//       }

//       return result
// }

const toMinutes = (time: string): number => {
      const [h, m] = time.split(":").map(Number)
      return h * 60 + m
}

export const timeAvailabilityIntersection = (venueOpeningHours: string[][], courierDeliveryHours: string[][]) => {
      let result = ""
      for(const [venueStartTime, venueEndtime] of venueOpeningHours) {
            // console.log("venue: ", `${venueStartTime}-${venueEndtime}`)
            for(const [courierStartTime, courierEndTime] of courierDeliveryHours) {
                  // console.log("courier: ", `${courierStartTime}-${courierEndTime}`)
                  //convert to minutes for accurate comparisons
                  const venueStart = toMinutes(venueStartTime)
                  const venueEnd = toMinutes(venueEndtime)
                  const courierStart = toMinutes(courierStartTime)
                  const courierEnd = toMinutes(courierEndTime)

                  // if(venueStart > courierEnd) {
                  //       continue
                  // }

                  const startTime = Math.max(venueStart, courierStart)
                  const endTime = Math.min(venueEnd, courierEnd)
                  //ensure the available intersection period is greater than 30 minutes
                  if(endTime > startTime && (endTime - startTime) > 30) {
                        //formatted in HH:mm style
                        const formattedStartTime = `${String(Math.floor(startTime/60)).padStart(2, "0")}:${String(startTime % 60).padStart(2, "0")}`
                        const formattedEndTime = `${String(Math.floor(endTime / 60)).padStart(2, "0")}:${String(endTime % 60).padStart(2, "0")}`
                        console.log(`${formattedStartTime}-${formattedEndTime}`)
// console.log("time: ", `${formattedStartTime}-${formattedEndTime}`)
                        if(result == "") {
                              result += `${formattedStartTime}-${formattedEndTime}`
                        } else{
                              console.log("helloo")
                              result += `, ${formattedStartTime}-${formattedEndTime}`
                        }
                  }

            }
      }

      return result
}