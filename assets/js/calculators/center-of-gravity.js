// Center of Gravity Calculator Calculation Module
document.getElementById('calc-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const input1 = parseFloat(document.getElementById('input1').value);
  const input2 = parseFloat(document.getElementById('input2').value);
  if (isNaN(input1)) {
    document.getElementById('results').textContent = 'Please enter a valid number for Input 1.';
    return;
  }
  const result = (input2 ? input1 + input2 : input1);
  document.getElementById('results').textContent = `Result: ${result}`;
});
