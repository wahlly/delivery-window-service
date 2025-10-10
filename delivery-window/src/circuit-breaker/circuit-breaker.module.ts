import { DynamicModule, Inject, Module } from '@nestjs/common';
import { ClientProxy, ClientsModule, ClientsModuleOptions } from '@nestjs/microservices';
import * as opossum from "opossum"
import { firstValueFrom } from 'rxjs';

export const CIRCUIT_BREAKER_FOR = (name: string) => `CIRCUIT_BREAKER_${name}`

@Module({})
export class CircuitBreakerModule {
      static forClients(clients: string[]): DynamicModule {
            const providers = clients.map((clientName) => ({
                  provide: CIRCUIT_BREAKER_FOR(clientName),
                  useFactory: () => {
                        //wrappable function.... to be replaced in the calling service
                        // const rmqCall = async(pattern: string, payload: any) => {
                        //       try {
                        //             return await firstValueFrom(client.send(pattern, payload))
                        //       } catch (error) {
                        //             console.error(`Error calling ${clientName} with pattern ${pattern}:`, error.message)
                        //             throw error
                        //       }
                        // }
                        const rmqPlaceholder = async() => {
                              throw new Error("rmq call not implemented")
                        }

                        const options = {
                              timeout: 3000, //timeout for message to be processed
                              errorThresholdPercentage: 50, //open circuit if 50% of requests fail 
                              resetTimeout: 5000, //wait 10s before half-opening
                              // volumeThreshold: 3
                        }
                        const breaker = new opossum(rmqPlaceholder, options)
                        breaker.fallback(() => `${clientName} is currently unavailable, try again later`)

                        breaker.on("fallback", (res: string) => console.log(res) )
                        breaker.on("open", () => console.log(`circuit breaker for ${clientName} is open`))
                        breaker.on("halfOpen", () => console.log(`circuit breaker for ${clientName} is half open`))
                        breaker.on("close", () => console.log(`circuit breaker for ${clientName} is closed`))

                        return breaker
                  }
            }))

            return {
                  module: CircuitBreakerModule,
                  // imports: [ClientsModule.register(clientsConfig)], //import clients
                  providers: providers,
                  exports: providers
            }
      }
}
