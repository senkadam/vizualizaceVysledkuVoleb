var csv = require("fast-csv");

const res = {}
const resP = {};
const resO = [];
const STRANA_ID = '9';
const sloupky_red=0;
const FILE_NAME='pst4p.csv';
const delimiter=';'

csv
    .fromPath(FILE_NAME,{delimiter})
    .on("data", function (data) {
        if (parseInt(data[0]) < 2000) {
            res[data[0]] = (res[data[0]] || 0) + parseInt(data[9+sloupky_red])
        }

    })
    .on("end", function () {
        csv
            .fromPath(FILE_NAME,{delimiter})
            .on("data", function (data) {
                if (parseInt(data[0]) < 2000) {
                    const okr = [data[9+sloupky_red], (parseInt(data[9+sloupky_red]) / res[data[0]]) * 100]
                    resP[data[8+sloupky_red]] = (resP[data[8+sloupky_red]] || {});
                    resP[data[8+sloupky_red]][data[6]] = okr;

                }

            })
            .on("end", function () {
                console.log(JSON.stringify(resP, null, 2))

                csv
                    .fromPath("okrskyOk.csv")
                    .on("data", function (data) {
                        if(parseInt(data[3])<3052) {
                            resO.push(data.concat(resP[STRANA_ID][data[3]][0]).concat(resP[STRANA_ID][data[3]][1]))
                        }
                    })
                    .on("end", function () {
                        const st = {};
                        const resF = [];

                        for(let i = 0; i< resO.length; i++){
                            if (!st[resO[i][1]]){
                                st[resO[i][1]]=true;
                                resF.push(resO[i]);
                            }
                        }

                        const resTotal = [['CITY','STREET','ZIP CODE', 'CO', 'HLASY', 'PERCENT']].concat(resF);


                        csv
                            .writeToPath("result2017.csv", resTotal, {headers: true})
                            .on("finish", function(){
                                console.log("done!");
                                console.log(JSON.stringify(resTotal, null, 2));
                            });


                    });
            });
    });



