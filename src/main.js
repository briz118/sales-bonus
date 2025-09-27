/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
/*function calculateSimpleRevenue(purchase, _product) {
   // @TODO: Расчет выручки от операции
   // purchase — это одна из записей в поле items из чека в data.purchase_records
   // _product — это продукт из коллекции data.products
   const { discount, sale_price, quantity } = purchase;
   
}*/

function calculateSimpleRevenue(purchase, _product) {
    const discount = 1 - (purchase.discount / 100);
    return purchase.sale_price * purchase.quantity * discount;
}




/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
/*function calculateBonusByProfit(index, total, seller) {
    // @TODO: Расчет бонуса от позиции в рейтинге
    const { profit } = seller;
}*/

function calculateBonusByProfit(index, total, seller) {
    if (index === 0) {
        return seller.profit * 0.15;
    } else if (index === 1 || index === 2) {
        return seller.profit * 0.10;
    } else if (index === total - 1) {
        return 0;
    } else {
        return seller.profit * 0.05;
    }
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
/*function analyzeSalesData(data, options) {
    if (!data
    || condition1
    || data.sellers.length === 0
) {
    throw new Error('Некорректные входные данные');
}

// Здесь проверим входящие данные
   const { calculateRevenue, calculateBonus } = options;

   if (!typeof calculateRevenue === "function" || !typeof calculateBonus === "function") {
    throw new Error('Чего-то не хватает');
} 

  const sellerStats = data.sellers.map(seller => ({
    sellerId: seller.id,
    fullName: `${seller.first_name} ${seller.last_name}`,
    position: seller.position,
    startDate: seller.start_date,
    }));

  const someIndex = Object.fromEntries(someArr.map(item => [item.ID, item]));

  const sellerIndex = {} // Ключом будет id, значением — запись из sellerStats
  const productIndex = {} // Ключом будет sku, значением — запись из data.products

  // Индекс продавцов по ID
const sellerIndex = data.sellers.reduce((index, seller) => {
    return {
        ...index,
        [seller.id]: seller
    };
}, {});

// Индекс товаров по SKU
const productIndex = data.products.reduce((index, product) => {
    return {
        ...index,
        [product.sku]: product
    };
}, {});

data.purchase_records.forEach(record => { // Чек 
        const seller = sellerIndex[record.seller_id]; // Продавец
        // Увеличить количество продаж 
        // Увеличить общую сумму всех продаж

        // Расчёт прибыли для каждого товара
        record.items.forEach(item => {
            const product = productIndex[item.sku]; // Товар
            // Посчитать себестоимость (cost) товара как product.purchase_price, умноженную на количество товаров из чека
            // Посчитать выручку (revenue) с учётом скидки через функцию calculateRevenue
            // Посчитать прибыль: выручка минус себестоимость
        // Увеличить общую накопленную прибыль (profit) у продавца  

            // Учёт количества проданных товаров
            if (!seller.products_sold[item.sku]) {
                seller.products_sold[item.sku] = 0;
            }
            // По артикулу товара увеличить его проданное количество у продавца
        });
 });
   // Сюда передадим функции для расчётов

   // Здесь посчитаем промежуточные данные и отсортируем продавцов

   // Вызовем функцию расчёта бонуса для каждого продавца в отсортированном массиве

   // Сформируем и вернём отчёт

    // @TODO: Проверка входных данных

    // @TODO: Проверка наличия опций

    // @TODO: Подготовка промежуточных данных для сбора статистики

    // @TODO: Индексация продавцов и товаров для быстрого доступа

    // @TODO: Расчет выручки и прибыли для каждого продавца

    // @TODO: Сортировка продавцов по прибыли

    // @TODO: Назначение премий на основе ранжирования

    // @TODO: Подготовка итоговой коллекции с нужными полями
}*/

function analyzeSalesData(data, options) {
    // Шаг 1: Проверка входных данных
    if (!data ||
        !Array.isArray(data.sellers) ||
        !Array.isArray(data.products) ||
        !Array.isArray(data.purchase_records) ||
        data.sellers.length === 0 ||
        data.products.length === 0 ||
        data.purchase_records.length === 0
    ) {
        throw new Error('Некорректные входные данные');
    }

    // Шаг 2: Проверка опций
    const { calculateRevenue, calculateBonus } = options;
    if (!calculateRevenue || !calculateBonus) {
        throw new Error('Отсутствуют необходимые функции в опциях');
    }

    // Шаг 3: Подготовка промежуточных данных
    const sellerStats = data.sellers.map(seller => ({
        seller_id: seller.id,
        name: `${seller.first_name} ${seller.last_name}`,
        revenue: 0,
        profit: 0,
        sales_count: 0,
        products_sold: {},
        bonus: 0
    }));

    // Шаг 4: Создание индексов
    const sellerIndex = Object.fromEntries(sellerStats.map(s => [s.seller_id, s]));
    const productIndex = Object.fromEntries(data.products.map(p => [p.sku, p]));

    // Шаг 5: Обработка продаж
    data.purchase_records.forEach(record => {
        const seller = sellerIndex[record.seller_id];
        if (!seller) return;

        seller.sales_count++;
        seller.revenue += record.total_amount;

        record.items.forEach(item => {
            const product = productIndex[item.sku];
            if (!product) return;

            const cost = product.purchase_price * item.quantity;
            const revenue = calculateRevenue(item, product);
            const profit = revenue - cost;

            seller.profit += profit;

            if (!seller.products_sold[item.sku]) {
                seller.products_sold[item.sku] = 0;
            }
            seller.products_sold[item.sku] += item.quantity;
        });
    });

    // Шаг 6: Сортировка продавцов
    sellerStats.sort((a, b) => b.profit - a.profit);

    // Шаг 7: Расчет бонусов и формирование топа продуктов
    sellerStats.forEach((seller, index) => {
        seller.bonus = calculateBonus(index, sellerStats.length, seller);
        
        seller.top_products = Object.entries(seller.products_sold)
            .map(([sku, quantity]) => ({ sku, quantity }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10);
    });

    // Шаг 8: Формирование итогового результата
    return sellerStats.map(seller => ({
        seller_id: seller.seller_id,
        name: seller.name,
        revenue: +seller.revenue.toFixed(2),
        profit: +seller.profit.toFixed(2),
        sales_count: seller.sales_count,
        top_products: seller.top_products,
        bonus: +seller.bonus.toFixed(2)
    }));
}