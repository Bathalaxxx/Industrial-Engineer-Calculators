document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const calculationType = document.getElementById('calculation-type');
    const basicFields = document.getElementById('basic-fields');
    const discountFields = document.getElementById('discount-fields');
    const backorderFields = document.getElementById('backorder-fields');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsDiv = document.getElementById('results');
    const exampleSection = document.getElementById('example-section');
    const interpretationSection = document.getElementById('interpretation-section');
    const interpretationContent = document.getElementById('interpretation-content');

    // Update form fields based on calculation type
    calculationType.addEventListener('change', function() {
        basicFields.style.display = 'block';
        discountFields.style.display = 'none';
        backorderFields.style.display = 'none';
        resultsDiv.style.display = 'none';
        interpretationSection.style.display = 'none';

        switch(this.value) {
            case 'basic':
                exampleSection.innerHTML = `
                    <h3>When to Use Basic EOQ</h3>
                    <p>Use the basic EOQ model when:</p>
                    <ul>
                        <li>You're ordering from suppliers with no quantity discounts</li>
                        <li>Stockouts are not allowed or are extremely costly</li>
                        <li>Demand is constant and known</li>
                        <li>Lead time is constant and known</li>
                    </ul>
                    <p><strong>Example:</strong> A retail store ordering standard items with consistent pricing where running out of stock would mean lost sales.</p>
                `;
                break;
            case 'discount':
                discountFields.style.display = 'block';
                exampleSection.innerHTML = `
                    <h3>When to Use Quantity Discount EOQ</h3>
                    <p>Use the quantity discount EOQ model when:</p>
                    <ul>
                        <li>Suppliers offer price discounts for larger quantities</li>
                        <li>The discount outweighs increased holding costs</li>
                        <li>You have sufficient storage capacity</li>
                    </ul>
                    <p><strong>Example:</strong> A manufacturer ordering raw materials where the supplier offers 5% discount for orders over 500 units.</p>
                `;
                break;
            case 'backorder':
                backorderFields.style.display = 'block';
                exampleSection.innerHTML = `
                    <h3>When to Use EOQ with Backorders</h3>
                    <p>Use the EOQ with backorders model when:</p>
                    <ul>
                        <li>Customers are willing to wait for backordered items</li>
                        <li>The cost of backordering is known and quantifiable</li>
                        <li>Stockouts don't result in lost sales, just delayed fulfillment</li>
                    </ul>
                    <p><strong>Example:</strong> A specialty item where customers understand it may need to be backordered, but there's a cost to managing backorders.</p>
                `;
                break;
        }
    });

    // Calculate EOQ
    calculateBtn.addEventListener('click', function() {
        const type = calculationType.value;
        const demand = parseFloat(document.getElementById('demand').value);
        const orderingCost = parseFloat(document.getElementById('ordering-cost').value);
        const holdingCost = parseFloat(document.getElementById('holding-cost').value);

        if (isNaN(demand) || isNaN(orderingCost) || isNaN(holdingCost) || demand <= 0 || orderingCost <= 0 || holdingCost <= 0) {
            alert('Please enter valid positive numbers for all required fields');
            return;
        }

        let eoq, totalCost, interpretation;
        
        switch(type) {
            case 'basic':
                eoq = calculateBasicEOQ(demand, orderingCost, holdingCost);
                totalCost = (demand * orderingCost / eoq) + (holdingCost * eoq / 2);
                interpretation = `
                    <p>The optimal order quantity is <strong>${Math.round(eoq)} units</strong>.</p>
                    <p><strong>Recommendations:</strong></p>
                    <ul>
                        <li>Order approximately ${Math.round(eoq)} units each time</li>
                        <li>You'll need to place about ${Math.round(demand / eoq * 10) / 10} orders per year</li>
                        <li>Total annual inventory cost will be $${totalCost.toFixed(2)}</li>
                        <li>Consider rounding to nearest practical quantity based on packaging</li>
                    </ul>
                `;
                break;
                
            case 'discount':
                const unitCost = parseFloat(document.getElementById('unit-cost').value);
                const discountRate = parseFloat(document.getElementById('discount-rate').value) / 100;
                const minQuantity = parseFloat(document.getElementById('min-quantity').value);
                
                if (isNaN(unitCost) || isNaN(discountRate) || isNaN(minQuantity)) {
                    alert('Please enter valid numbers for all discount fields');
                    return;
                }
                
                const discountedPrice = unitCost * (1 - discountRate);
                const discountHoldingCost = holdingCost * (1 - discountRate);
                
                // Calculate EOQ with discount
                const discountEOQ = calculateBasicEOQ(demand, orderingCost, discountHoldingCost);
                
                // Determine if we should take the discount
                let optimalQty;
                if (discountEOQ >= minQuantity) {
                    optimalQty = discountEOQ;
                } else {
                    // Compare total costs at min quantity vs regular EOQ
                    const regularEOQ = calculateBasicEOQ(demand, orderingCost, holdingCost);
                    const costAtMinQty = (demand * discountedPrice) + 
                                         (demand * orderingCost / minQuantity) + 
                                         (discountHoldingCost * minQuantity / 2);
                    const costAtRegularEOQ = (demand * unitCost) + 
                                            (demand * orderingCost / regularEOQ) + 
                                            (holdingCost * regularEOQ / 2);
                    
                    optimalQty = costAtMinQty < costAtRegularEOQ ? minQuantity : regularEOQ;
                }
                
                const finalPrice = optimalQty >= minQuantity ? discountedPrice : unitCost;
                const finalHoldingCost = optimalQty >= minQuantity ? discountHoldingCost : holdingCost;
                totalCost = (demand * finalPrice) + 
                           (demand * orderingCost / optimalQty) + 
                           (finalHoldingCost * optimalQty / 2);
                
                interpretation = `
                    <p>The optimal order quantity is <strong>${Math.round(optimalQty)} units</strong>.</p>
                    <p>This ${optimalQty >= minQuantity ? 'qualifies' : 'does not qualify'} for the quantity discount.</p>
                    <p><strong>Recommendations:</strong></p>
                    <ul>
                        <li>Order ${Math.round(optimalQty)} units at $${finalPrice.toFixed(2)} each</li>
                        <li>Total annual cost: $${totalCost.toFixed(2)}</li>
                        ${optimalQty >= minQuantity ? 
                          '<li>You qualify for the discount - consider this cost-saving option</li>' : 
                          '<li>The discount quantity isn\'t cost-effective - stick with regular EOQ</li>'}
                        <li>Evaluate storage capacity before committing to larger orders</li>
                    </ul>
                `;
                eoq = optimalQty;
                break;
                
            case 'backorder':
                const backorderCost = parseFloat(document.getElementById('backorder-cost').value);
                
                if (isNaN(backorderCost) || backorderCost <= 0) {
                    alert('Please enter a valid positive number for backorder cost');
                    return;
                }
                
                eoq = calculateBasicEOQ(demand, orderingCost, holdingCost) * 
                      Math.sqrt((holdingCost + backorderCost) / backorderCost);
                
                const maxInventory = calculateBasicEOQ(demand, orderingCost, holdingCost) * 
                                    Math.sqrt(backorderCost / (holdingCost + backorderCost));
                
                totalCost = (demand * orderingCost / eoq) + 
                           (Math.pow(maxInventory, 2) * holdingCost / (2 * eoq)) + 
                           (Math.pow(eoq - maxInventory, 2) * backorderCost / (2 * eoq));
                
                interpretation = `
                    <p>The optimal order quantity is <strong>${Math.round(eoq)} units</strong>.</p>
                    <p>Maximum inventory level should be <strong>${Math.round(maxInventory)} units</strong>.</p>
                    <p><strong>Recommendations:</strong></p>
                    <ul>
                        <li>Order ${Math.round(eoq)} units when inventory reaches ${Math.round(eoq - maxInventory)} backorders</li>
                        <li>Total annual cost: $${totalCost.toFixed(2)}</li>
                        <li>Monitor backorder levels closely to maintain customer satisfaction</li>
                        <li>Consider whether the backorder cost accurately reflects customer impact</li>
                    </ul>
                `;
                break;
        }
        
        // Display results
        document.getElementById('result-content').innerHTML = `
            <p><strong>Economic Order Quantity:</strong> ${Math.round(eoq)} units</p>
            <p><strong>Number of Orders per Year:</strong> ${(demand / eoq).toFixed(1)}</p>
            <p><strong>Time Between Orders:</strong> ${(365 / (demand / eoq)).toFixed(1)} days</p>
            <p><strong>Total Annual Cost:</strong> $${totalCost.toFixed(2)}</p>
        `;
        
        interpretationContent.innerHTML = interpretation;
        resultsDiv.style.display = 'block';
        interpretationSection.style.display = 'block';
    });

    function calculateBasicEOQ(demand, orderingCost, holdingCost) {
        return Math.sqrt((2 * demand * orderingCost) / holdingCost);
    }
});
