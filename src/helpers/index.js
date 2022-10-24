module.exports = {
    calculateTokenAmount: (amount) => {
        if(amount > 999 && amount <= 14000){
           return (amount / 0.008).toFixed(0)
        }
     
      //   if(amount >= 5000 && amount < 10000){
      //      return (amount / 0.0105).toFixed(0)
      //   }
     
      //   if(amount >= 10000 && amount <= 14000){
      //     return (amount / 0.0103).toFixed(0)
      //   }
     }
}