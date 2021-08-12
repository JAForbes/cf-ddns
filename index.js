import fetch from 'node-fetch'

async function main(){
    // Get the current IP
    let ip = await fetch('https://icanhazip.com').then( x => x.text() )

    let baseURL = `https://api.cloudflare.com/client/v4`

    let xs = await fetch(`${baseURL}/zones/${process.env.CF_ZONE_ID}/dns_records`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.CF_TOKEN}`
        }
    })
    .then( x => x.json() )
    .then( x => x.result )

    let existing;
    for(let x of xs){
        if( x.name == process.env.A_RECORD_NAME ) {
            existing = x;
            break;
        }
    }

    let original = {
        type: 'A',
        name: process.env.A_RECORD_NAME,
        content: ip,
        ttl: 120,
    }
    let body = JSON.stringify(original)

    let headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.CF_TOKEN}`
    }

    let res;
    if( existing ) {
        res = await fetch(`${baseURL}/zones/${process.env.CF_ZONE_ID}/dns_records/${existing.id}`, {
            method: 'PATCH', headers, body
        })

    } else {
        res = await fetch(`${baseURL}/zones/${process.env.CF_ZONE_ID}/dns_records`, {
            method: 'POST', headers, body
        })
    }
    
    if( res.status < 300 ) {
        console.log(original.name,'set to', original.content)       
    } else {
        console.log(headers)
        throw new Error(`Could not set ${original.name} to ${original.content} (${res.status}, ${JSON.stringify(await res.json())})`)
    }
}

main()
.catch(e => {
    console.error(e)
    process.exit(1)
})