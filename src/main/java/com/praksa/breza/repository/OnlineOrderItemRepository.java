package com.praksa.breza.repository;

import java.util.*;

import com.praksa.breza.domain.OnlineOrderItem;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the OnlineOrderItem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OnlineOrderItemRepository extends JpaRepository<OnlineOrderItem, Long> {
    public List<OnlineOrderItem> findByOnlineOrderId(Long id);
}
