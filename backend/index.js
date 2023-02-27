import express from "express";

import { PrismaClient } from "@prisma/client"

const app = express();
const prisma = new PrismaClient()
const port = 3000

app.use(express.json())

app.get("/", async (req, res) => {
    try {
        const data = await prisma.travel.findMany()
        return res.status(200).json(data)
    } catch (err) {
        console.log(err)
        return res.status(500).send("Error")
    }
})

app.post("/", async (req, res) => {
    try {
        const data = await prisma.travel.create({ data: {
            ...req.body,
            tanggal_jam : new Date(req.body.tanggal_jam)
        } })
        return res.status(200).json(data)
    } catch (err) {
        console.log(err)
        return res.status(500).send("Error")
    }
})

app.delete("/:id", async (req, res) => {
    try {
        const data = await prisma.travel.delete({where : {
            id : parseInt(req.params.id)
        }})
        return res.status(200).send(data)
    } catch (err) {
        console.log(err)
        return res.status(500).send("Error")
    }
})

app.put("/:id", async (req, res) => {
 try {
    const result = await prisma.travel.update({
        where : {
            id : parseInt(req.params.id)
        },
        data : {
          ...req.body,
            tanggal_jam : new Date(req.body.tanggal_jam)
        }
    })
    return res.status(200).send(result)
 }  catch(err) {
    console.log(err)
    return res.status(500).send("Server error: " )
 } 
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})