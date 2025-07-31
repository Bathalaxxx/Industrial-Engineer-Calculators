document.addEventListener('DOMContentLoaded', function() {
    // Ensure common elements are loaded first
    if (!document.getElementById('sidebar-placeholder').innerHTML) {
        setTimeout(arguments.callee, 100);
        return;
    }

    // DOM elements
    const variationSelect = document.getElementById('variation');
    const discountGroup = document.getElementById('discount-group');
    const calculateBtn = document.getElementById('calculate');
    const resultsDiv = document.getElementById('results');
    const resultOutput = document.getElementById('result-output');
    const exampleInfo = document.getElementById('example-info');

    // Set active menu item
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.parentElement.classList.add('active');
            // Expand parent category
            const category = link.closest('ul').previousElementSibling;
            if (category) {
                category.classList.remove('collapsed');
                link.closest('ul').classList.remove('collapsed');
            }
        }
    });

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
        if (isNaN(demand) || demand <= 0) {
            alert('Please enter a valid positive number for annual demand');
            return;
        }
        if (isNaN(orderCost) || orderCost <= 0) {
            alert('Please enter a valid positive number for order cost');
            return;
        }
        if (isNaN(holdingCost) || holdingCost <= 0) {
            alert('Please enter a valid positive number for holding cost');
            return;
        }

        let eoq, totalCost, ordersPerYear, recommendation;
        
        switch(variation) {
            case 'basic':
                eoq = Math.sqrt((2 * demand * orderCost) / holdingCost);
                totalCost = (demand / eoq * orderCost) + (eoq / 2 * holdingCost);
                ordersPerYear = demand / eoq;
                recommendation = `Order ${Math.round(eoq)} units about ${Math.round(ordersPerYear * 10)/10} times per year`;
                break;
                
            case 'discount':
                const discountRate = parseFloat(document.getElementById('discount-rate').value) / 100;
                if (isNaN(discountRate) {
                    alert('Please enter a valid discount rate');
                    return;
                }
                const adjustedHolding = holdingCost * (1 - discountRate);
                eoq = Math.sqrt((2 * demand * orderCost) / adjustedHolding);
                totalCost = (demand / eoq * orderCost) + (eoq / 2 * adjustedHolding);
                ordersPerYear = demand / eoq;
                recommendation = `With ${(discountRate * 100).toFixed(1)}% discount, order ${Math.round(eoq)} units about ${Math.round(ordersPerYear * 10)/10} times annually`;
                break;
                
            case 'backorder':
                // Simplified backorder model (more complex models would use backorder cost)
                eoq = Math.sqrt((2 * demand * orderCost) / holdingCost) * 1.2;
                totalCost = (demand / eoq * orderCost) + (eoq / 2 * holdingCost * 0.8);
                ordersPerYear = demand / eoq;
                recommendation = `With backorders allowed, order ${Math.round(eoq)} units about ${Math.round(ordersPerYear * 10)/10} times per year`;
                break;
        }

        // Display results
        resultOutput.innerHTML = `
            <p><strong>Optimal Order Quantity:</strong> ${Math.round(eoq)} units</p>
            <p><strong>Orders Per Year:</strong> ${ordersPerYear.toFixed(1)}</p>
            <p><strong>Cycle Time:</strong> ${(365 / ordersPerYear).toFixed(1)} days</p>
            <p><strong>Total Annual Cost:</strong> $${totalCost.toFixed(2)}</p>
            <p><strong>Recommendation:</strong> ${recommendation}</p>
        `;
        resultsDiv.style.display = 'block';
    });

    // Update example based on selected variation
    function updateExample() {
        const examples = {
            basic: `A retailer sells 10,000 units/year with $50 ordering cost and $2.50 holding cost/unit.`,
            discount: `A manufacturer orders components with 5% discount on orders over 500 units. Order cost is $75 and holding cost is $3/unit.`,
            backorder: `A specialty store allows backorders with $5 penalty cost per backordered unit. Annual demand is 8,000 units with $60 order cost and $4 holding cost.`
        };
        exampleInfo.innerHTML = `<h4>${variationSelect.options[variationSelect.selectedIndex].text} Example</h4>
                               <p>${examples[variationSelect.value]}</p>`;
    }

    // Initialize
    updateExample();
});
