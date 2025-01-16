document.getElementById("configForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const startIp = document.getElementById("startIp").value;
    const endIp = document.getElementById("endIp").value;

    // Parse start and end IPs
    const startParts = startIp.split('.').map(Number);
    const endParts = endIp.split('.').map(Number);

    // Validate IP ranges
    if (startParts.length !== 4 || endParts.length !== 4) {
        alert("Invalid IP format. Please enter valid IPv4 addresses.");
        return;
    }

    let ipRange = [];
    for (let i = startParts[3]; i <= endParts[3]; i++) {
        ipRange.push(`${startParts[0]}.${startParts[1]}.${startParts[2]}.${i}`);
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
