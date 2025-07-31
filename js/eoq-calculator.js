document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const variationSelect = document.getElementById('variation');
    const discountGroup = document.getElementById('discount-group');
    const calculateBtn = document.getElementById('calculate');
    const resultsDiv = document.getElementById('results');
    const resultOutput = document.getElementById('result-output');
    const exampleInfo = document.getElementById('example-info');

    // Toggle discount field based on calculation type
    variationSelect.addEventListener('change', function() {
        discountGroup.style.display = this.value === 'discount' ? 'block' : 'none';
        updateExample();
    });

    // Calculate EOQ
    calculateBtn.addEventListener('click', function() {
        // Get input values
        const demand = parseFloat(document.getElementById('demand').value);
        const orderCost = parseFloat(document.getElementById('order-cost').value);
        const holdingCost = parseFloat(document.getElementById('holding-cost').value);
        const variation = variationSelect.value;

        // Validate inputs
        if ([demand, orderCost, holdingCost].some(isNaN)) {
            alert('Please enter valid numbers for all fields');
            return;
        }

        let eoq, totalCost, interpretation;
        
        switch(variation) {
            case 'basic':
                eoq = Math.sqrt((2 * demand * orderCost) / holdingCost);
                totalCost = (demand / eoq * orderCost) + (eoq / 2 * holdingCost);
                interpretation = `Order ${Math.round(eoq)} units ${(demand / eoq).toFixed(1)} times per year`;
                break;
                
            case 'discount':
                const discountRate = parseFloat(document.getElementById('discount-rate').value) / 100;
                if (isNaN(discountRate)) {
                    alert('Please enter a valid discount rate');
                    return;
                }
                const adjustedHolding = holdingCost * (1 - discountRate);
                eoq = Math.sqrt((2 * demand * orderCost) / adjustedHolding);
                totalCost = (demand / eoq * orderCost) + (eoq / 2 * adjustedHolding);
                interpretation = `With ${discountRate * 100}% discount, order ${Math.round(eoq)} units`;
                break;
                
            case 'backorder':
                // Simplified backorder model
                eoq = Math.sqrt((2 * demand * orderCost) / holdingCost) * 1.2; // Example adjustment
                totalCost = (demand / eoq * orderCost) + (eoq / 2 * holdingCost * 0.8); // Example adjustment
                interpretation = `With backorders allowed, order ${Math.round(eoq)} units`;
                break;
        }

        // Display results
        resultOutput.innerHTML = `
            <p><strong>Optimal Order Quantity:</strong> ${Math.round(eoq)} units</p>
            <p><strong>Orders Per Year:</strong> ${(demand / eoq).toFixed(1)}</p>
            <p><strong>Total Annual Cost:</strong> $${totalCost.toFixed(2)}</p>
            <p><strong>Recommendation:</strong> ${interpretation}</p>
        `;
        resultsDiv.style.display = 'block';
    });

    // Update example based on selected variation
    function updateExample() {
        const examples = {
            basic: `A retailer sells 10,000 units/year with $50 ordering cost and $2.50 holding cost/unit.`,
            discount: `A manufacturer orders components with 5% discount on orders over 500 units.`,
            backorder: `A specialty store allows backorders with $5 penalty cost per backordered unit.`
        };
        exampleInfo.innerHTML = `<h4>${variationSelect.options[variationSelect.selectedIndex].text} Example</h4>
                               <p>${examples[variationSelect.value]}</p>`;
    }
});
