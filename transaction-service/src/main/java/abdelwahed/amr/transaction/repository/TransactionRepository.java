package abdelwahed.amr.transaction.repository;

import abdelwahed.amr.transaction.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TransactionRepository extends MongoRepository<Transaction, String> {
}