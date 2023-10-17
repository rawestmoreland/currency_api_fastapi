def compute_rates_for_base(data: dict, new_base: str):
    base_to_new_base_rate = data['rates'][new_base]
    new_rates = {new_base: 1.0}

    for currency, rate in data['rates'].items():
        if currency == new_base:
            continue
        new_rates[currency] = rate / base_to_new_base_rate

    return {"base": new_base, "rates": new_rates}


def compute_rates_for_all_bases(data):
    all_rates = {}

    for currency in data['rates'].keys():
        rates_for_currency = compute_rates_for_base(data, currency)
        all_rates[currency] = rates_for_currency['rates']

    return all_rates
