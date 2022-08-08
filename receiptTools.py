# Setting the priority level.
# 0: standard process.
# 1: debug mode.
# 2: verbose debug mode.
CURRENT_PRIORITY_LEVEL = 2

# Parses a message and determines whether to print it or not.
def refer(message, priority):
    global CURRENT_PRIORITY_LEVEL
    if CURRENT_PRIORITY_LEVEL >= priority:
        print(message)

# Stores have a lot of receipts for them.
class Store:
    def __init__(self, name):
        self.name = name
        self.receipts = []
        self.totalDollarsGiven = 0
        refer(f"Successfully made Store object for {self.name}.",
                1)
    
    def addReceipt(self, receipt):
        self.receipts.append(receipt)
        self.totalDollarsGiven += receipt.total
        refer(f"Successfully added receipt from {receipt.dateTime} to the {self.name}'s list.",
                2)
    
    def getReceipt(self, index):
        refer(f"{self.name}: Returning self.receipts[{index}].", 2)
        return self.receipts[index]

    def getNumReceipts(self):
        refer(f"{self.name}: Returning len(self.receipts), which is {len(self.receipts)}.", 2)
        return len(self.receipts)

    def receiptManager(self):
        refer(f"Receipt manager for {self.name} entered.",
                 2)
        inp = input("Do you want to ADD new receipt or BROWSE old receipts?\n ").lower()
        if "add" in inp:
            dateTime = input("When was this receipt from?\n ")
            total = float(input("What was the total?\n "))
            tax = float(input("What was the tax on the receipt?\n "))
            self.addReceipt(Receipt(dateTime, total, tax))
        elif "browse" in inp:
            # Print out 8 receipts at a time.
            inp = input("> Next Page, < Previous Page; enter a number to select a receipt.\n ")
        else:
            refer(f"Issue in receiptManager for {self.name}: User entered unusable information.", 
                    1)
            

    

# Conglomerates are groups of stores.
class Conglomerate:
    def __init__(self, name):
        self.name = name
        self.stores = {}
        self.totalDollarsGiven = 0
        refer(f"Successfully made Conglomerate object for '{self.name}'.",
                1)

    def addStore(self, store):
        self.stores[store.name] = store
        refer(f"Successfully added store '{store.name}' to '{self.name}'.",
                2)

    def printStores(self):
        refer(self.stores, 0)

    def getStore(self, storeName):
        refer(f"{self.name}: Returning self.stores['{storeName}'].", 2)
        return self.stores[storeName]

# Receipts store the information of the items in there and the total value of the receipt.
class Receipt:
    def __init__(self, dateTime, total, tax):
        self.dateTime = dateTime
        self.total = total
        self.tax = tax
        self.items = []
        refer(f"Successfully made Receipt object from {self.dateTime} with total price {self.total}.",
                1)
        
    
    def addItem(self, quantity, name, price):
        self.items.append([quantity, name, price])
        refer((f"Added {quantity} {name}(s) to the receipt at price {price}."),
                2)

    def printInfo(self):
        refer(f"Receipt from {self.dateTime} of tax {self.tax} and total {self.total}:",
                 0)
        for item in self.items:
            refer(f"{item.count} of {item.name} for a total of ${item.price}.",
                    0)


print("\n")

# Let's make some stores. 
was = Conglomerate("Sam's Club + Walmart")
was.addStore(Store("Walmart"))
was.addStore(Store("Sam's Club"))

was.printStores()
print("\n\n")

# Adding some receipts to these stores.
was.getStore("Walmart").receiptManager()
if was.getStore("Walmart").getNumReceipts() > 0:
    was.getStore("Walmart").getReceipt(0).printInfo()
