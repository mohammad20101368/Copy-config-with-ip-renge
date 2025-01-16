document.getElementById("configForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // گرفتن مقادیر فرم
    const baseConfigInput = document.getElementById("baseConfig").value;
    const cidrRange = document.getElementById("cidrRange").value;

    let baseConfig;

    // بررسی و تجزیه JSON کانفیگ اولیه
    try {
        baseConfig = JSON.parse(baseConfigInput);
    } catch (err) {
        alert("Invalid JSON format in Base Config. Please fix it and try again.");
        return;
    }

    // تجزیه و بررسی CIDR
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

    // تولید رنج IP
    const ipRange = [];
    for (let i = startIp; i <= endIp; i++) {
        ipRange.push(decimalToIp(i));
    }

    // اضافه کردن کلاینت‌ها به کانفیگ
    const clients = ipRange.map(ip => ({
        id: ip,
        level: 0,
        email: `user_${ip}@example.com`
    }));

    if (!baseConfig.inbounds || !Array.isArray(baseConfig.inbounds) || baseConfig.inbounds.length === 0) {
        alert("Base config must include at least one 'inbound' object.");
        return;
    }

    baseConfig.inbounds[0].settings.clients = clients;

    // نمایش کانفیگ نهایی
    document.getElementById("output").value = JSON.stringify(baseConfig, null, 4);
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
