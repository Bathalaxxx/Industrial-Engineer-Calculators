
async function loadCalculators() {
  try {
    const res = await fetch('/calculators.json');
    const data = await res.json();
    const listContainer = document.getElementById('calc-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    Object.entries(data).forEach(([subject, calcs]) => {
      const section = document.createElement('section');
      const heading = document.createElement('h2');
      heading.textContent = subject.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      section.appendChild(heading);

      const ul = document.createElement('ul');
      calcs.forEach(calc => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `/calculators/${subject}/${calc.slug}.html`;
        a.textContent = calc.title;
        li.appendChild(a);
        ul.appendChild(li);
      });
      section.appendChild(ul);
      listContainer.appendChild(section);
    });
  } catch (err) {
    console.error('Error loading calculators.json', err);
  }
}

document.addEventListener('DOMContentLoaded', loadCalculators);
