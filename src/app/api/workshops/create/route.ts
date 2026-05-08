import { prisma } from '@/lib/prisma'

import { PDFDocument, StandardFonts } from 'pdf-lib'
import QRCode from 'qrcode'
export async function POST(req: Request) {
    const body = await req.json()
    const { name, date, droneTypes } = body
    const workshop = await prisma.workshop.create({
        data: {
            name,
            date: new Date(date),
        },
    })
    const createdDrones: any[] = []
    for (const item of droneTypes) {
        const droneType = await prisma.droneType.findUnique({
            where: {
                id: item.typeId,
            },
        })
        if (!droneType) continue
        for (let i = 1; i <= item.count; i++) {
            const droneId = `${droneType.name}-${Date.now()}-${i}`
            const drone = await prisma.drone.create({
                data: {
                    id: droneId,
                    qrCode: `${process.env.APP_URL}/drone/${droneId}`,
                    workshopId: workshop.id,
                    typeId: droneType.id,
                },
            })
            createdDrones.push(drone)
        }
    }
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595, 842])
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    let x = 50
    let y = 740
    for (const drone of createdDrones) {
        const qrDataUrl = await QRCode.toDataURL(drone.qrCode)
        const qrImageBytes = Buffer.from(
            qrDataUrl.replace(/^data:image\/png;base64,/, ''),
            'base64'
        )
        const pngImage = await pdfDoc.embedPng(qrImageBytes)
        page.drawImage(pngImage, {
            x,
            y,
            width: 100,
            height: 100,
        })
        page.drawText(drone.id, {
            x,
            y: y - 20,
            size: 10,
            font,
        })
        x += 150
        if (x > 400) {
            x = 50
            y -= 160
        }
    }
    const pdfBytes = await pdfDoc.save()
    return new Response(pdfBytes, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${workshop.name}.pdf"`,
        },
    })
}
