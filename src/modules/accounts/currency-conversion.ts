import { ConfigService } from "@nestjs/config";
import { Injectable, Logger} from "@nestjs/common";
import axios from 'axios';



@Injectable()
export class ConversionCurrencies {
    constructor(private readonly configService:ConfigService){}

    oandaClient(){

        const OANDA = require('oanda-exchange-rates');

        const client = new OANDA({
        api_key: this.configService.get<string>("OANDA_API_KEY")
        });
        return client
    };


    oandaGetCurrencies(clientOanda): Promise<any> {
        return new Promise((resolve, reject) => {
            clientOanda.getCurrencies('oanda', (response) => {
            if (response.success) {
                resolve(response.data);
            } else {
                reject(`Error fetching currencies: ${response.errorCode}, ${response.errorMessage}`);
                }
              });
            });
            }
   

    async convertAmount(amount: number, fromCurrency: string, toCurrency: string): Promise<any> {
        try {
            if (fromCurrency.toUpperCase() === toCurrency.toUpperCase()) {
                return amount;
            }

            const apiKey = this.configService.get<string>("OANDA_API_KEY");
            
            if (!apiKey) {
                throw new Error("OANDA_API_KEY is not configured");
            }

            // Use a free forex API that doesn't require complex setup
            const response = await axios.get(
                `https://api.fxratesapi.com/latest`,
                {
                    params: {
                        base: fromCurrency,
                        symbols: toCurrency
                    },
                    timeout: 5000 
                }
            );

            const rate = response.data.rates[toCurrency];
            
            if (!rate) {
                throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
            }

            const convertedAmount = amount * rate;
            const roundedAmount = Math.round(convertedAmount * 100) / 100; 

            Logger.log(`Converted ${amount} ${fromCurrency} to ${roundedAmount} ${toCurrency} (rate: ${rate})`);
            
            return roundedAmount;

        } catch (error) {
            Logger.error(`Conversion failed: ${error.message}`);
            throw error
        };
      };
    };

