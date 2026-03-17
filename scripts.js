async function renderSections(jsonPath, containerId) {
    try {
        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const container = document.getElementById(containerId);
        if (!container) throw new Error(`Container ${containerId} not found`);

        // Add container styling
        container.style.maxWidth = "1200px";
        container.style.margin = "0 auto";
        container.style.padding = "20px";

        data.forEach((item, index) => {
            const box = createCard(item, index);
            container.appendChild(box);
        });

    } catch (error) {
        console.error('Error rendering sections:', error);
        showError(containerId, error.message);
    }
}

function createCard(item, index) {
    const box = document.createElement("div");
    
    // Modern card styling with gradient overlay for better text contrast
    const baseColor = item.color || "#f5f5f5";
    const isDarkColor = isColorDark(baseColor);
    const textColor = isDarkColor ? "#ffffff" : "#333333";
    const accentColor = isDarkColor ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";
    
    // Card styles
    Object.assign(box.style, {
        display: "flex",
        flexDirection: window.innerWidth < 768 ? "column" : "row",
        justifyContent: "space-between",
        alignItems: window.innerWidth < 768 ? "stretch" : "center",
        width: "100%",
        marginBottom: "20px",
        padding: "20px",
        boxSizing: "border-box",
        borderRadius: "16px",
        background: `linear-gradient(135deg, ${baseColor} 0%, ${adjustColor(baseColor, 20)} 100%)`,
        boxShadow: "0 10px 30px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.05)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "default",
        color: textColor,
        border: `1px solid ${isDarkColor ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`
    });

    // Hover effects
    box.addEventListener('mouseenter', () => {
        box.style.transform = 'translateY(-4px)';
        box.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
    });
    
    box.addEventListener('mouseleave', () => {
        box.style.transform = 'translateY(0)';
        box.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
    });

    const left = createLeftSection(item, textColor, accentColor, isDarkColor);
    const right = createRightSection(item, textColor, accentColor, isDarkColor);

    box.appendChild(left);
    box.appendChild(right);
    
    return box;
}

function createLeftSection(item, textColor, accentColor, isDarkColor) {
    const left = document.createElement("div");
    left.style.flex = "1";
    left.style.paddingRight = window.innerWidth < 768 ? "0" : "20px";
    left.style.marginBottom = window.innerWidth < 768 ? "20px" : "0";

    for (let key in item) {
        if (key === "image_path" || key === "color") continue;

        const field = createField(key, item[key], textColor, accentColor, isDarkColor);
        if (field) left.appendChild(field);
    }

    return left;
}

function createRightSection(item, textColor, accentColor, isDarkColor) {
    const right = document.createElement("div");
    
    Object.assign(right.style, {
        width: window.innerWidth < 768 ? "100%" : "140px",
        height: window.innerWidth < 768 ? "200px" : "140px",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
        border: `2px solid ${isDarkColor ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.8)'}`,
        transition: "transform 0.3s ease"
    });

    if (item.image_path) {
        const img = createImageElement(item.image_path, textColor);
        right.appendChild(img);
        
        // Image hover effect
        right.addEventListener('mouseenter', () => {
            right.style.transform = 'scale(1.02)';
        });
        
        right.addEventListener('mouseleave', () => {
            right.style.transform = 'scale(1)';
        });
    }

    return right;
}

function createField(key, value, textColor, accentColor, isDarkColor) {
    const field = document.createElement("div");
    field.style.marginBottom = "10px";
    field.style.lineHeight = "1.5";

    // Reference field
    if (key === "reference" && value && value.reference_link) {
        field.innerHTML = `<strong style="color: ${textColor};">reference:</strong> `;
        const link = createLink(
            value.reference_link, 
            value["ref_hyperlink display name"] || "View reference",
            textColor
        );
        field.appendChild(link);
        return field;
    }

    // Team mates
    if (key === "team mates" && Array.isArray(value)) {
        const container = document.createElement("div");
        
        const title = document.createElement("div");
        title.innerHTML = `<strong style="color: ${textColor};">teammates:</strong>`;
        title.style.marginBottom = "8px";
        container.appendChild(title);

        const list = document.createElement("ol");
        list.style.margin = "0 0 10px 20px";
        list.style.padding = "0";
        list.style.color = textColor;

        value.forEach(member => {
            const li = document.createElement("li");
            li.style.marginBottom = "4px";

            if (member["reference link of name"]) {
                const a = createLink(
                    member["reference link of name"],
                    member.name || "Team member",
                    textColor
                );
                li.appendChild(a);
            } else {
                li.textContent = member.name || "Team member";
            }

            list.appendChild(li);
        });

        container.appendChild(list);
        return container;
    }

    // Object with link
    if (typeof value === "object" && value !== null) {
        const keys = Object.keys(value);
        if (keys.length === 2 && value[keys[1]] && value[keys[1]].includes("http")) {
            field.innerHTML = `<strong style="color: ${textColor};">${key}:</strong> `;
            const link = createLink(
                value[keys[1]], 
                value[keys[0]] || "View link",
                textColor
            );
            field.appendChild(link);
            return field;
        }
        
        if (keys.length > 0) {
            field.innerHTML = `<strong style="color: ${textColor};">${key}:</strong> ${JSON.stringify(value)}`;
            return field;
        }
    }

    // Normal field
    if (value) {
        field.innerHTML = `<strong style="color: ${textColor};">${key}:</strong> ${value}`;
        return field;
    }

    return null;
}

function createLink(href, text, textColor) {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = text;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const linkColor = "#2563eb";        // blue
    const hoverColor = "#1d4ed8";       // darker blue

    Object.assign(link.style, {
        color: linkColor,
        fontWeight: "500",
        textDecoration: "none",
        borderBottom: `2px solid ${linkColor}`,
        transition: "all 0.2s ease"
    });

    link.addEventListener("mouseenter", () => {
        link.style.color = hoverColor;
        link.style.borderBottomColor = hoverColor;
    });

    link.addEventListener("mouseleave", () => {
        link.style.color = linkColor;
        link.style.borderBottomColor = linkColor;
    });

    return link;
}

function createImageElement(imagePath, textColor) {
    const img = document.createElement("img");
    img.src = imagePath;
    img.alt = "Image";
    img.loading = "lazy";
    
    Object.assign(img.style, {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        cursor: "pointer",
        transition: "transform 0.5s ease"
    });

    img.onclick = () => createImagePopup(imagePath);
    img.onerror = () => {
        img.style.objectFit = "contain";
        img.style.padding = "20px";
        img.style.backgroundColor = "rgba(0,0,0,0.1)";
    };

    return img;
}

function createImagePopup(imagePath) {
    const overlay = document.createElement("div");
    
    Object.assign(overlay.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "9999",
        opacity: "0",
        transition: "opacity 0.3s ease",
        cursor: "pointer"
    });

    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.maxWidth = "90%";
    container.style.maxHeight = "90%";

    const popupImg = document.createElement("img");
    popupImg.src = imagePath;
    
    Object.assign(popupImg.style, {
        maxWidth: "100%",
        maxHeight: "90vh",
        borderRadius: "12px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        transform: "scale(0.9)",
        transition: "transform 0.3s ease",
        cursor: "default"
    });

    const closeButton = createCloseButton();
    
    container.appendChild(popupImg);
    container.appendChild(closeButton);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    // Trigger animations
    setTimeout(() => overlay.style.opacity = "1", 10);
    setTimeout(() => popupImg.style.transform = "scale(1)", 20);

    // Close handlers
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            closePopup(overlay);
        }
    };

    closeButton.onclick = () => closePopup(overlay);

    // Keyboard close
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closePopup(overlay);
            document.removeEventListener('keydown', escHandler);
        }
    });
}

function createCloseButton() {
    const button = document.createElement("button");
    button.innerHTML = "×";
    
    Object.assign(button.style, {
        position: "absolute",
        top: "-40px",
        right: "0",
        background: "none",
        border: "none",
        color: "white",
        fontSize: "40px",
        cursor: "pointer",
        padding: "0 10px",
        transition: "transform 0.2s ease",
        opacity: "0.7"
    });

    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.1)';
        button.style.opacity = '1';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
        button.style.opacity = '0.7';
    });

    return button;
}

function closePopup(overlay) {
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 300);
}

function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const errorDiv = document.createElement("div");
    Object.assign(errorDiv.style, {
        padding: "20px",
        backgroundColor: "#fee",
        color: "#c00",
        borderRadius: "8px",
        textAlign: "center",
        margin: "20px"
    });
    errorDiv.textContent = `Error loading content: ${message}`;
    container.appendChild(errorDiv);
}

// Utility functions for color handling
function isColorDark(color) {
    // Convert hex to RGB
    let r, g, b;
    
    if (color.startsWith('#')) {
        const hex = color.substring(1);
        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        }
    } else if (color.startsWith('rgb')) {
        const matches = color.match(/\d+/g);
        if (matches) {
            r = parseInt(matches[0]);
            g = parseInt(matches[1]);
            b = parseInt(matches[2]);
        }
    } else {
        return false; // Default to light mode for unknown colors
    }

    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
}

function adjustColor(color, percent) {
    // Simple color adjustment for gradient
    if (color.startsWith('#')) {
        let r = parseInt(color.substring(1, 3), 16);
        let g = parseInt(color.substring(3, 5), 16);
        let b = parseInt(color.substring(5, 7), 16);
        
        r = Math.min(255, Math.max(0, r + percent));
        g = Math.min(255, Math.max(0, g + percent));
        b = Math.min(255, Math.max(0, b + percent));
        
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }
    return color;
}

// Add responsive resize handler
window.addEventListener('resize', () => {
    // Trigger re-render if needed
    console.log('Window resized - consider re-rendering for optimal layout');
});


async function renderPersonalDetails(jsonPath, containerId){

    try{

        const response = await fetch(jsonPath);
        const data = await response.json();

        const container = document.getElementById(containerId);
        container.innerHTML = "";

        const card = document.createElement("div");

        Object.assign(card.style,{
            display:"flex",
            flexWrap:"wrap",
            gap:"40px",
            alignItems:"flex-start",
            justifyContent:"center",
            maxWidth:"1000px",
            margin:"auto"
        });

        const left = createPersonalLeft(data);
        const right = createPersonalRight(data);

        card.appendChild(left);
        card.appendChild(right);

        container.appendChild(card);

    }catch(error){
        console.error("Error loading personal details",error);
    }

}



function createPersonalLeft(data){

    const left = document.createElement("div");

    Object.assign(left.style,{
        flex:"1",
        minWidth:"260px",
        textAlign:"center"
    });

    const img = document.createElement("img");
    img.src = data.image;

    Object.assign(img.style,{
        width:"200px",
        height:"200px",
        objectFit:"cover",
        borderRadius:"50%",
        marginBottom:"20px",
        boxShadow:"0 5px 20px rgba(0,0,0,0.2)"
    });

    const about = document.createElement("p");
    about.textContent = data.about;

    Object.assign(about.style,{
        lineHeight:"1.6",
        fontSize:"15px"
    });

    left.appendChild(img);
    left.appendChild(about);

    return left;
}



function createPersonalRight(data) {

    const right = document.createElement("div");

    Object.assign(right.style, {
        flex: "1",
        minWidth: "300px"
    });

    const skipFields = ["image", "about"];

    Object.keys(data)
        .filter(key => !skipFields.includes(key))
        .forEach(key => {

            const value = data[key];

            // If it's a link object
            if (value && typeof value === "object" && value.url) {
                addDynamicLink(right, key, value);
            } 
            // Normal text field
            else {
                addField(right, key, value);
            }
        });

    return right;
}

function addDynamicLink(container, label, obj) {

    const row = document.createElement("p");

    const link = document.createElement("a");
    link.href = obj.url;
    link.textContent = obj["display name"] || obj.url;
    link.target = "_blank";

    link.style.color = "#2563eb";
    link.style.textDecoration = "none";

    row.innerHTML = `<strong>${label}:</strong> `;
    row.appendChild(link);

    container.appendChild(row);
}


function addField(container,label,value){

    const row = document.createElement("p");

    row.innerHTML = `<strong>${label}:</strong> ${value}`;

    row.style.marginBottom = "10px";

    container.appendChild(row);
}



function addLink(container,label,obj){

    if(!obj) return;

    const row = document.createElement("p");

    const link = document.createElement("a");
    link.href = obj.url;
    link.textContent = obj["display name"];
    link.target = "_blank";

    link.style.color = "#2563eb";
    link.style.textDecoration = "none";

    row.innerHTML = `<strong>${label}:</strong> `;
    row.appendChild(link);

    container.appendChild(row);
}

async function renderSkillSet(jsonPath, containerId){

    try{

        const response = await fetch(jsonPath);
        const data = await response.json();

        const container = document.getElementById(containerId);
        container.innerHTML = "";

        const domainMap = {};

        // group skills by domain
        data.forEach(skill => {

            if(!domainMap[skill.domain]){
                domainMap[skill.domain] = [];
            }

            domainMap[skill.domain].push(skill);

        });


        for(const domain in domainMap){

            const section = createDomainSection(domain, domainMap[domain]);
            container.appendChild(section);

        }

    }catch(error){
        console.error("Skillset loading error:", error);
    }

}



function createDomainSection(domain, skills){

    const wrapper = document.createElement("div");

    wrapper.style.marginBottom = "40px";


    const title = document.createElement("h3");
    title.textContent = domain;

    Object.assign(title.style,{
        textAlign:"center",
        marginBottom:"20px"
    });


    const skillRow = document.createElement("div");

    Object.assign(skillRow.style,{
        display:"flex",
        flexWrap:"wrap",
        justifyContent:"center",
        gap:"25px"
    });


    skills.forEach(skill => {

        const card = createSkillCard(skill);
        skillRow.appendChild(card);

    });


    wrapper.appendChild(title);
    wrapper.appendChild(skillRow);

    return wrapper;

}



function createSkillCard(skill){

    const card = document.createElement("div");

    Object.assign(card.style,{
        width:"100px",
        textAlign:"center"
    });


    const img = document.createElement("img");
    img.src = skill.image;

    Object.assign(img.style,{
        width:"70px",
        height:"70px",
        objectFit:"contain",
        display:"block",
        margin:"0 auto 8px auto"
    });


    const name = document.createElement("div");
    name.textContent = skill.name;

    Object.assign(name.style,{
        fontSize:"14px"
    });


    card.appendChild(img);
    card.appendChild(name);

    return card;

}