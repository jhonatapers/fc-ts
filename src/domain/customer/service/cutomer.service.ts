import EventDispatcherInterface from "../../@shared/event/event-dispatcher.interface";
import Customer from "../entity/customer";
import CustomerAddressChangedEvent from "../event/customer-address-changed.event";
import CustomerCreatedEvent from "../event/customer-created.event";
import CustomerRepositoryInterface from "../repository/customer-repository.interface";
import Address from "../value-object/address";

export default class CustomerService {

    private customerRepository: CustomerRepositoryInterface;

    private dispatcher: EventDispatcherInterface;

    constructor(customerRepository: CustomerRepositoryInterface, dispatcher: EventDispatcherInterface = null) {
        this.customerRepository = customerRepository;
        this.dispatcher = dispatcher;
    }

    withCustomerRepository(customerRepository: CustomerRepositoryInterface) {
        this.customerRepository = customerRepository;
    }

    createCustomer(customer: Customer): void {

        if (!this.customerRepository)
            throw Error('CustomerRepositoryInterface not defined')

        this.customerRepository.create(customer);

        if (this.dispatcher)
            this.dispatcher.notify(new CustomerCreatedEvent(customer))

    }

    async changeAddress(customerId: string, address: Address): Promise<void> {

        if (!this.customerRepository)
            throw Error('CustomerRepositoryInterface not defined')

        const customer = await this.customerRepository.find(customerId)
        customer.changeAddress(address);
        await this.customerRepository.update(customer);

        if (this.dispatcher)
            this.dispatcher.notify(new CustomerAddressChangedEvent(customer))

    }

}