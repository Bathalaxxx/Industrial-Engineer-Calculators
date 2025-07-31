document.addEventListener('DOMContentLoaded', function() {
    const calculationType = document.getElementById('calculation-type');
    const basicInputs = document.getElementById('basic-inputs');
    const discountInputs = document.getElementById('discount-inputs');
    const productionInputs = document.getElementById('production-inputs');
    const basicExample = document.getElementById('basic-example');
    const discountExample = document.getElementById('discount-example');
    const productionExample = document.getElementById('production-example');
    const calculateBtn = document.getElementById('calculate');
    const resultsDiv = document.getElementById('results');
    const resultValues = document.getElementById('result-values');
    const interpretationText = document.getElementById('interpretation-text');

    // Show/hide input sections based on selected variation
    calculationType.addEventListener('change', function() {
        basicInputs.style.display = 'block';
        discountInputs.style.display = 'none';
        productionInputs.style.display = 'none';
        basicExample.style.display = 'block';
        discountExample.style.display = 'none';
        productionExample.style.display = 'none';

        switch(this.value) {
            case 'discount':
                discountInputs.style.display = 'block';
                discountExample.style.display = 'block';
                basicExample.style.display = 'none';
                break;
            case 'production':
                productionInputs.style.display = 'block';
                productionExample.style.display = 'block';
                basicExample.style.display = 'none';
                break;
        }
    });

    // Calculate EOQ
    calculateBtn.addEventListener('click', function() {
        const demand = parseFloat(document.getElementById('demand').value);
        const setupCost = parseFloat(document.getElementById('setup-cost').value);
        const holdingCost = parseFloat(document.getElementById('holding-cost').value);
        const type = calculationType.value;

        let eoq, totalCost, recommendation;
        
        switch(type) {
            case 'basic':
                eoq = Math.sqrt((2 * demand * setupCost) / holdingCost);
                totalCost = (demand * setupCost / eoq) + (eoq * holdingCost / 2);
                recommendation = `Order ${Math.round(eoq)} units each time to minimize total inventory costs.`;
                break;
                
            case 'discount':
                const discountQty = parseFloat(document.getElementById('discount-quantity').value) || 0;
                const discountRate = (parseFloat(document.getElementById('discount-rate').value) || 0) / 100;
                const discountedHoldingCost = holdingCost * (1 - discountRate);
                
                // Calculate EOQ with discount
                eoq = Math.sqrt((2 * demand * setupCost) / discountedHoldingCost);
                
                // Check if discount quantity is worth it
                if(eoq >= discountQty) {
                    totalCost = (demand * setupCost / eoq) + (eoq * discountedHoldingCost / 2);
                    recommendation = `Order ${Math.round(eoq)} units to qualify for the discount and minimize costs.`;
                } else {
                    // Compare costs with and without discount
                    const regularEOQ = Math.sqrt((2 * demand * setupCost) / holdingCost);
                    const regularCost = (demand * setupCost / regularEOQ) + (regularEOQ * holdingCost / 2);
                    const discountCostAtThreshold = (demand * setupCost / discountQty) + (discountQty * discountedHoldingCost / 2);
                    
                    if(discountCostAtThreshold < regularCost) {
                        eoq = discountQty;
                        totalCost = discountCostAtThreshold;
                        recommendation = `Order exactly ${discountQty} units to qualify for the discount and save money.`;
                    } else {
                        eoq = regularEOQ;
                        totalCost = regularCost;
                        recommendation = `Stick with regular orders of ${Math.round(regularEOQ)} units - the discount isn't worth it.`;
                    }
                }
                break;
                
            case 'production':
                const productionRate = parseFloat(document.getElementById('production-rate').value);
                const demandRate = parseFloat(document.getElementById('demand-rate').value);
                
                if(productionRate <= demandRate) {
                    alert("Production rate must exceed demand rate!");
                    return;
                }
                
                eoq = Math.sqrt((2 * demand * setupCost) / (holdingCost * (1 - (demandRate/productionRate))));
                totalCost = (demand * setupCost / eoq) + (holdingCost * (eoq/2) * (1 - (demandRate/productionRate));
                recommendation = `Produce batches of ${Math.round(eoq)} units to minimize inventory costs.`;
                break;
        }
        
        // Display results
        resultValues.innerHTML = `
            <p><strong>Optimal Order Quantity:</strong> ${Math.round(eoq)} units</p>
            <p><strong>Total Annual Cost:</strong> $${totalCost.toFixed(2)}</p>
            <p><strong>Number of Orders:</strong> ${Math.ceil(demand/eoq)}</p>
            <p><strong>Time Between Orders:</strong> ${(365/(demand/eoq)).toFixed(1)} days</p>
        `;
        
        interpretationText.textContent = recommendation;
        resultsDiv.style.display = 'block';
    });
});
