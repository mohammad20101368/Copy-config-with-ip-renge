document.getElementById("configForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const cidrRange = document.getElementById("cidrRange").value;

    // Parse CIDR range
    const [baseIp, subnet] = cidrRange.split("/");
    if (!baseIp || !subnet || isNaN(subnet)) {
        alert("Invalid CIDR format. Please enter a valid CIDR range (e.g., 192.168.1.0/24).");
        return;
    }

    const ipParts = baseIp.split(".").map(Number);
    if (ipParts.length !== 4 || ipParts.some(part => part < 0 || part > 255)) {
        alert("Invalid base IP address. Please enter a valid IPv4 address.");
        return;
    }

    const startIp = ipToDecimal(ipParts);
    const totalIps = Math.pow(2, 32 - subnet);
    const endIp = startIp + totalIps - 1;

    // Generate IP range
    const ipRange = [];
    for (let i = startIp; i <= endIp; i++) {
        ipRange.push(decimalToIp(i));
    }

    // Generate VLESS config
    const config = {
        log: {
            loglevel: "info"
        },
        inbounds: [
            {
                port: 443,
                protocol: "vless",
                settings: {
                    clients: ipRange.map(ip => ({
                        id: ip,
                        level: 0,
                        email: `user_${ip}@example.com`
                    }))
                },
                streamSettings: {
                    network: "tcp"
                }
            }
        ],
        outbounds: [
            {
                protocol: "freedom",
                settings: {}
            }
        ]
    };

    // Display config as JSON
    document.getElementById("output").value = JSON.stringify(config, null, 4);
});

function ipToDecimal(ipParts) {
    return (
        (ipParts[0] << 24) +
        (ipParts[1] << 16) +
        (ipParts[2] << 8) +
        ipParts[3]
    );
}

function decimalToIp(decimal) {
    return [
        (decimal >>> 24) & 255,
        (decimal >>> 16) & 255,
        (decimal >>> 8) & 255,
        decimal & 255
    ].join(".");
                }
