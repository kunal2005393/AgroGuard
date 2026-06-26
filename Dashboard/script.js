const connectBtn = document.getElementById("connect");

let port;
let reader;

connectBtn.addEventListener("click", async () => {

    try {

        if (!port) {

            port = await navigator.serial.requestPort();

            await port.open({
                baudRate: 9600
            });

            alert("Arduino Connected!");

            const decoder = new TextDecoderStream();

            port.readable.pipeTo(decoder.writable);

            reader = decoder.readable.getReader();
        }

        while (true) {

            const { value, done } = await reader.read();

            if (done)
                break;

            if (value) {

                console.log("Received:", value);

                let lines = value.split(/\r?\n/);

                lines.forEach(line => {

                    line = line.trim();

                    if (line.length == 0)
                        return;

                    let data = line.split(",");

                    console.log(data);

                    if (data.length >= 7) {

                        document.getElementById("crop").innerText = data[0];
                        document.getElementById("soil").innerText = data[1] + "%";
                        document.getElementById("temp").innerText = data[2] + " °C";
                        document.getElementById("humidity").innerText = data[3] + "%";
                        document.getElementById("tank").innerText = data[4] + "%";
                        document.getElementById("fhi").innerText = data[5] + "/100";
                        document.getElementById("recommendation").innerText = data[6];

                    }

                });

            }

        }

    }
    catch(error)
    {
        console.error(error);
        alert(error.message);
    }

});