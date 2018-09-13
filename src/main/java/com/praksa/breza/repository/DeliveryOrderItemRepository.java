package com.praksa.breza.repository;

import java.util.List;

import com.praksa.breza.domain.DeliveryOrderItem;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the DeliveryOrderItem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DeliveryOrderItemRepository extends JpaRepository<DeliveryOrderItem, Long> {
    public List<DeliveryOrderItem> findByDeliveryOrderId(Long id);
}
