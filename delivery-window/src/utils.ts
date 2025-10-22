
export const parseTimeRanges = (timeRange: string) => {
      return timeRange.split(",").map(timeSession => {
            const [start, end] = timeSession.trim().split("-")
            return [start, end]
      })
}

const toMinutes = (time: string): number => {
      const [h, m] = time.split(":").map(Number)
      return h * 60 + m
}

export const timeAvailabilityIntersection = (venueOpeningHours: string[][], courierDeliveryHours: string[][]) => {
      let result = ""
      for(let i = 0; i < venueOpeningHours.length; i++) {
            const [venueStartTime, venueEndtime] = venueOpeningHours[i]
            // console.log("venue: ", venueStartTime, "-", venueEndtime)

            for(let j = 0; j < courierDeliveryHours.length; j++) {
                  const [courierStartTime, courierEndTime] = courierDeliveryHours[j]
                  // console.log("courier: ", courierStartTime, "-", courierEndTime)
                  //convert to minutes for accurate comparisons
                  let venueStart = toMinutes(venueStartTime)
                  let venueEnd = toMinutes(venueEndtime)
                  let courierStart = toMinutes(courierStartTime)
                  let courierEnd = toMinutes(courierEndTime)

                  //handle overnight window (crossing midnight)
                  if(venueEnd < venueStart) {
                        venueEnd += 1440 //add 24 hours
                  }
                  if(courierEnd < courierStart) {
                        courierEnd += 1440
                  }

                  if(venueStart > courierEnd) { //skip courier windows already iterated
                        continue
                  }

                  const startTime = Math.max(venueStart, courierStart)
                  const endTime = Math.min(venueEnd, courierEnd)
                  // console.log("kd: ", startTime, "-", endTime)
                  //ensure the available intersection period is greater than 30 minutes
                  if(endTime > startTime && (endTime - startTime) > 30) { //check if its a valid time range, and time range difference is greater than 30 minutes
                        //format in HH:mm style
                        const formattedStartTime = `${String(Math.floor(startTime/60) % 24).padStart(2, "0")}:${String(startTime % 60).padStart(2, "0")}`
                        const formattedEndTime = `${String(Math.floor(endTime / 60) % 24).padStart(2, "0")}:${String(endTime % 60).padStart(2, "0")}`
                        // console.log(`${formattedStartTime}-${formattedEndTime}`)

                        if(result == "") {
                              result += `${formattedStartTime}-${formattedEndTime}`
                        } else{
                              result += `, ${formattedStartTime}-${formattedEndTime}`
                        }
                  }

            }
      }

      return result
}