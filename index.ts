import express from 'express'

import cors from 'cors'

const app = express()
app.use(cors( ))
app.use(express.json())
const port = 4001

type House = {
    id: number,
    address: string,
    type: "house" | "farm" | "flat"
}


type Resident = {
    id: number,
    name:  string,
    age: number,
    gender: "male" | "female",
    houseId: number
}


let houses: House[] = [
    {
        id: 1,
        address: "9521 School Lane, PORTSMOUTH, PO59 3UC",
        type: "flat"
    },
    {
        id: 2,
        address: "90 Kings Road, NEWCASTLE UPON TYNE, NE55 4FS",
        type: "house"
    },
    {
        id: 3,
        address: "378 New Road, BLACKBURN, BB7 6EJ",
        type: "farm"
    },
    {
        id: 4,
        address: "49 North Road, DARTFORD, DA26 4NZ",
        type: "house"
    },
    {
        id: 5,
        address: "83 Mill Road, NORTH LONDON, N26 0UW",
        type: "flat"
    },
    {
        id: 6,
        address: "79 Albert Road, PETERBOROUGH, PE88 6UO",
        type: "farm"
    },
    {
        id: 7,
        address: "64 Victoria Road, SUNDERLAND, SR31 6FD",
        type: "house"
    }
]

let residents: Resident[] = [
    {
        id: 1,
        name: "John",
        age: 25,
        gender: "male",
        houseId: 5
    },
    {
        id: 2,
        name: "Anna",
        age: 52,
        gender: "female",
        houseId: 2
    },
    {
        id: 3,
        name: "Loris",
        age: 30,
        gender: "male",
        houseId: 2
    },
    {
        id: 4,
        name: "Solei",
        age: 28,
        gender: "female",
        houseId: 1
    },
    {
        id:4,
        name: "Peter",
        age: 41,
        gender: "male",
        houseId: 4 
    },
    {
        id: 5,
        name: "Mary",
        age: 66,
        gender: "female",
        houseId: 3
    },
    {
        id: 6,
        name: "Alex",
        age: 35,
        gender: "male",
        houseId: 1
    },
    {
        id: 7,
        name: "Erica",
        age: 50,
        gender: "female",
        houseId: 7
    },
    {
        id: 8,
        name: "Bea",
        age: 5,
        gender: "female",
        houseId: 6
    },
    {
        id: 9,
        name: "Henry",
        age: 32,
        gender: "male",
        houseId: 6
    },
    {
        id: 10,
        name: "Elisabeth",
        age: 31,
        gender: 'female',
        houseId: 6
    }
]


app.get('/', (req, res) => {
    res.send(`
       <h1> Welcome to my API</h1>
       <p>These are the available endpoints: </p> 
       <ul> 
       <li> <a href="/residents"> /residents </a></li>
       <li> <a href="/houses"> /houses </a></li>
       </ul>
       `)
})


app.get('/residents', (req, res) => {
    let residentsCopy = JSON.parse(JSON.stringify(residents))

    for (const resident of residentsCopy) {
        const house = houses.find((house) => house.id === resident.houseId)
        resident.house = house
    }
    res.send(residents)
})

app.get('/residents/:id', (req, res) => {
    const id = Number(req.params.id)
    const match = residents.find(resident => resident.id === id)
    if (match) {
        res.send(match)
    } else {
        res.status(404).send({ error: 'Resident not found'});
    }    
})

app.post('/residents', (req, res) => {
    const errors :string[] = []

    if (typeof req.body.name !== "string" )
    errors.push("Name is missing or is not a string")
    if(typeof req.body.age !== "number")
    errors.push("Age is missing or is not a number")
    if (typeof req.body.gender !== "string")
    errors.push("Gender is missing or is not of type 'male' or 'female'! ")
    if (typeof req.body.houseId !== "number") 
    errors.push("HouseId not given or not a number")

    let house = houses.find (house => house.id === req.body.houseId)
    if(!house) errors.push(`House with id ${req.body.houseId} doesn't exist!`)

    if (errors.length === 0) {
        let newResident: Resident = {
            id: residents.length === 0 ? 1 : residents[residents.length - 1].id + 1,
            name: req.body.name,  
            age: req.body.age,
            gender: req.body.gender,
            houseId: req.body.houseId
        }
        residents.push(newResident)
        res.send(newResident)
    }  else {
        res.status(400).send ({errors: errors})
    }

})

app.patch('/residents/:id', (req, res) => {
    let id = Number(req.params.id)
    let match = residents.find(resident => resident.id === id)

    if(match) {
        if (req.body.name) {
            match.name = req.body.name
        }

        if (req.body.age) {
            match.age = req.body.age
        }

        if (req.body.gender) {
            match.gender = req.body.gender
        }

        if (req.body.houseId) {
            match.houseId = req.body.houseId
        }
    } else {
        res.status(404).send({ error: "Resident not found"})
    }


})

app.delete('/residents/:id', (req, res) => {
    const id = Number(req.params.id)
    const indexToDelete = residents.findIndex(resident => resident.id === id)

    if (indexToDelete > -1) {
        residents = residents.filter( resident => resident.id !== id)
        res.send({ message: "Resident deleted successfully." })
    } else {
        res.status(404).send({ error: "Resident not found!" })
    }

})


app.get('/houses', (req, res) => {
    res.send(houses)
})

app.get('/houses/:id', (req, res) => {
    const id = Number(req.params.id)
    const match = houses.find(house => house.id === id)
    if (match) {
        res.send(match)
    } else {
        res.status(404).send({ error: 'House not found'})
    }
})

app.listen(port, ()=> {
    console.log(`Server is on: http://localhost:${port}`)
})