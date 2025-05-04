export const categoryToSpecMap = {
    "RAM": {
        "brand": [],
        "type": ['DDR4', 'DDR5', 'DDR6'],
        "capacity": ['8GB', '16GB', '32GB', '64GB'],
        "speed": "form",
        "modules": "form",
        "ecc": "form",
        "voltage": "form"
    },

    "GPU": {
        "brand": ["AMD", "NVIDIA"],
        "vram": ['4GB', '8GB', '12GB', '16GB', '32GB', '64GB'],
        "raytracing": [true, false],
        "series": "form",
        "boostclock": "form",
        "lengthmm": "form",
        "powerconsumption": "form"
    },

    "CPU": {
        "brand": ["AMD", "INTEL"],
        "cores": [8, 12, 16, 20, 32],
        "threads": [2, 4, 6, 8, 12, 16, 24, 32],
        "baseclock": "form",
        "boostclock": "form",
        "tdp": "form",
        "socket": "form",
        "integratedgraphics": [true, false]
    },

    "MOTHERBOARD": {
        "brand": ["ASUS", "MSI", "Gigabyte", "ASRock"],
        "formfactor": ["ATX", "Micro-ATX", "Mini-ITX", "E-ATX"],
        "wifi": [true, false],
        "bluetooth": [true, false],
        "rgb": [true, false],
        "chipset": "form",
        "socket": "form",
        "memorysupport": "form",
        "maxram": "form",
        "m2slots": "form",
        "sataports": "form",
        "pcieslots": "form"
    },

    "LAPTOP": {
        "brand": ["Dell", "HP", "Lenovo", "Asus", "Acer", "Apple"],
        "dedicatedgpu": [true, false],
        "displaysize": [13.3, 14, 15.6, 16, 17.3, 11.6],
        "ram": [4, 8, 16, 32, 64, 128],
        "processor": "form",
        "storage": "form",
        "operatingsystem": "form",
        "battery": "form",
        "weight": "form"
    },

    "PSU": {
        "wattage": [450, 500, 550, 600, 650, 750, 850, 1000, 1200, 1300, 1600],
        "formfactor": ["ATX", "MicroATX", "SFX", "SFX-L", "TFX", "Flex ATX"],
        "brand": "form",
        "modularity": "form",
        "efficiencyrating": "form",
        "rgb": [true, false],
        "pcieconnectors": "form",
        "sataconnectors": "form"
    },

    "MONITOR": {
        "brand": ["Dell", "LG", "Asus", "Acer", "Samsung", "BenQ", "MSI", "HP"],
        "displaysize": [21.5, 23.8, 24, 25, 27, 32, 34, 38, 49],
        "refreshrate": [60, 75, 120, 144, 165, 240, 360],
        "curved": [true, false],
        "syncsupport": ["None", "FreeSync", "G-Sync", "Adaptive Sync"],
        "resolution": "form",
        "aspectratio": "form",
        "panelltype": "form",
        "brightnessnits": "form",
        "ports": "form",
        "touchscreen": [true, false]
    },

    "COOLER": {
        "brand": ["Noctua", "Cooler Master", "Corsair", "NZXT", "Arctic", "Deepcool", "Thermaltake"],
        "fansize": [92, 120, 140, 240, 280, 360, 420],
        "fanrpm": [600, 1200, 1500, 1800, 2000, 2500],
        "rgb": [true, false],
        "coolertype": "form",
        "radiatorsize": "form",
        "socketcompatibility": "form",
        "noiseleveldb": "form",
        "heightmm": "form"
    }
}
