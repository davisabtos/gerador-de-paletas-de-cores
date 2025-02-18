//Função para capturar a cor escolhida e o esquema
function chooseColor() {
    const hex = document.getElementById("color").value;  // Pega o valor do input de cor
    const scheme = document.getElementById("scheme").value;  // Pega o esquema de cores escolhido

    // Converte HEX para RGB
    let { r, g, b } = hexToRgb(hex);

    // Converte RGB para HSL
    let { h, s, l } = rgbToHsl(r, g, b);

    // Gera a paleta com base no esquema
    let colors = generatePalette(h, s, l, scheme);

    // Exibe a paleta na página
    showPalette(colors);
}

// Função para converter HEX para RGB
function hexToRgb(hex) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

// Função para converter RGB para HSL
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // Sem cor
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        if (max === r) {
            h = (g - b) / d + (g < b ? 6 : 0);
        } else if (max === g) {
            h = (b - r) / d + 2;
        } else {
            h = (r - g) / d + 4;
        }
        h *= 60;
    }

    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// Função para gerar a paleta de cores com base no esquema escolhido
function generatePalette(h, s, l, scheme) {
    let colors = [];

    switch (scheme) {
        case "Monocromatico":
            for (let i = -40; i <= 40; i += 20) {
                colors.push(hslToHex(h, s, Math.max(0, Math.min(100, l + i))));
            }
            break;

        case "Analogo":
            for (let i = -30; i <= 30; i += 15) {
                colors.push(hslToHex((h + i + 360) % 360, s, l));
            }
            break;

        case "Complementar":
            colors.push(hslToHex(h, s, l));
            colors.push(hslToHex((h + 180) % 360, s, l));
            colors.push(hslToHex((h + 150) % 360, s, l));
            colors.push(hslToHex((h + 210) % 360, s, l));
            colors.push(hslToHex(h, s, Math.max(0, Math.min(100, l + 20))));
            break;

        case "Neutro":
            for (let i = 0; i < 5; i++) {
                colors.push(hslToHex(h, s * 0.5, 20 + i * 20));
            }
            break;
    }

    return colors;
}

// Função para converter HSL para HEX
function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;

    let r, g, b;
    if (h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (h < 300) {
        r = x;
        g = 0;
        b = c;
    } else {
        r = c;
        g = 0;
        b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase()}`;
}

// Função para exibir a paleta na página
function showPalette(colors) {
    for (let i = 0; i < colors.length; i++) {
        let colorDiv = document.getElementById(`colorPallete-${i + 1}`);
        if (colorDiv) {
            colorDiv.style.backgroundColor = colors[i];
            colorDiv.textContent = colors[i];  // Exibe o código da cor
        }
    }
}

// Função para copiar a cor ao clicar na div
function copyColor(id) {
    const colorDiv = document.getElementById(id);
    const color = colorDiv.textContent;
    navigator.clipboard.writeText(color).then(() => {
        alert(`Cor ${color} copiada!`);
    });
}
