import { InMemoryDbService } from 'angular-in-memory-web-api';

import { SurveyData } from './survey';

export class Data implements InMemoryDbService {

    createDb(): {} {
        const surveyData: SurveyData[] = [
            {
                id: 1,
                line1: 1,
                line2: "M G Road, Mysore",

                members: [{
                    name: "prashant",
                    gender: "male",
                    age: 22
                }]
            },


            {
                id: 2,
                line1: 22,
                line2: "M G Road, Mysore",

                members: [{
                    name: "prashant",
                    gender: "male",
                    age: 22
                }]

            },
            {
                id: 3,
                line1: 23,
                line2: "M G Road, Mysore",

                members: [{
                    name: "prashant",
                    gender: "male",
                    age: 22
                }]
            },
            {
                id: 4,
                line1: 24,
                line2: "M G Road, Mysore",
                members: [{
                    name: "prashant",
                    gender: "male",
                    age: 66
                },
                {
                    name: "Prakash",
                    gender: "male",
                    age: 62

                }]
            }
        ];
        return { surveyData };
    }
}
